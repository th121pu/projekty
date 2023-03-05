import logging
import json
import psycopg2
from pandas import DataFrame
import tempfile
import smtplib, ssl
from os import listdir

import azure.functions as func
from azure.storage.blob import  BlobClient,  __version__


def main(message: func.ServiceBusMessage):
    message_body = message.get_body().decode("utf-8")

    logging.info("Python ServiceBus topic trigger processed message.")
    logging.info(message_body)

  # convert string to  object
    json_object = json.loads(message_body)
    userId = json_object["userId"]
    tenant = json_object["tenant"]
    studentEmail = json_object["studentEmail"]

    optionsString = "-c search_path=" + tenant
    df = None

    tempFilePath = tempfile.gettempdir()
    fp = tempfile.NamedTemporaryFile()
    filesDirListInTemp = listdir(tempFilePath)

    try:
        connection = psycopg2.connect(host="uni-canteen.postgres.database.azure.com",
                                      database="postgres",
                                      user="cloud_tuke",
                                      password="Heslo123tuke",
                                      options=optionsString)
        cursor = connection.cursor()
        postgres_insert_query = "select m.date as datum_objednavky, f.name as jedlo, c.name as jedalen, m.price as  cena  from all_orders ao, menu m, food f, canteen c where ao.menu_id = m.id  and m.food_id  = f.id and ao .canteen_id = c.id and ao.user_object_id = %s"
        cursor.execute(postgres_insert_query, (
            userId,))
        connection.commit()
        df = DataFrame(cursor.fetchall(), columns=['Date', 'Food', 'Canteen', 'Price'])
        df.to_csv(fp, sep='\t', encoding='utf-8')

    except (Exception, psycopg2.Error) as error:
        logging.info("Failed to select records from DB ")
        logging.info(error)

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()
            logging.info("PostgreSQL connection is closed")

    blob_url = None
# blob storage
    try:
        blob = BlobClient.from_connection_string(
            conn_str="DefaultEndpointsProtocol=https;AccountName=functionappscloudy;AccountKey=yKLgiGWscrpY6HlW0UxNMESivlO6vHStxmrZE5nsnBHMjcVfwPA9rxOVviFESXCZy2mGiaPFSOzMsKOPjWr4WQ==;EndpointSuffix=core.windows.net",
            container_name="user-receipts",
            blob_name = "user-" + str(userId) + "-" + tenant + "-receipt" + ".csv")
        #  upload the created file
        with open(fp.name, "rb") as data:
            blob.upload_blob(data, overwrite=True)
            blob_url = blob.url
    except Exception as ex:
        logging.info('Exception:')
        logging.info(ex)

    # send receipt to user email

    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = "canteen.uni@gmail.com"
    password = "hnypsbskihxjmeuk"
    context = ssl.create_default_context()
    SUBJECT_STUDENT = "UniCanteen: Your receipt is available"
    TEXT_STUDENT = "Hello! Your receipt has been generated. Click on this link to see your order history! UniCanteen Team " + blob_url
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()
        server.starttls(context=context)  # Secure the connection using the tls protocol
        server.login(sender_email, password)
        message_student = 'Subject: {}\n\n{}'.format(SUBJECT_STUDENT, TEXT_STUDENT)
        server.sendmail(sender_email, studentEmail, message_student)
    except Exception as e:
        logging.info("Failed to send emails")
    finally:
        server.quit()

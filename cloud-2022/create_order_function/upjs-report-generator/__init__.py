import datetime
import logging
import tempfile
from os import listdir
from pandas import DataFrame
import smtplib
import ssl
import psycopg2
import azure.functions as func
from azure.storage.blob import BlobClient,  __version__


def main(mytimer: func.TimerRequest) -> None:
    adminEmail = "domca.moly@gmail.com"
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    optionsString = "-c search_path=upjs_canteens"
    df = None
    df2 = None

    tempFilePathReportCanteens = tempfile.gettempdir()
    fpReportCanteens = tempfile.NamedTemporaryFile()
    filesDirListInTemp = listdir(tempFilePathReportCanteens)

    tempFilePathReportFood = tempfile.gettempdir()
    fpReportFood = tempfile.NamedTemporaryFile()
    filesDirListInTemp = listdir(tempFilePathReportFood)

    try:
        connection = psycopg2.connect(host="uni-canteen.postgres.database.azure.com",
                                      database="postgres",
                                      user="cloud_tuke",
                                      password="Heslo123tuke",
                                      options=optionsString)
        cursor = connection.cursor()
        postgres_select_query= "select c.name as nazov_kantiny, count(*) as pocet, sum(m.price) as zisk from canteen c, all_orders ao, menu m where ao.canteen_id = c.id and ao.menu_id = m.id and m.date >= now() - interval '7' day group by c.name"
        cursor.execute(postgres_select_query)
        connection.commit()
        df = DataFrame(cursor.fetchall(), columns=[
                       'Canteen', 'Order count', 'Total profit'])
        df.to_csv(fpReportCanteens, sep=';', encoding='utf-8')
        logging.info("AAA")
        logging.info(df)
        postgres_select_query2 = "select f.name as jeduo, count(*) as pocet, sum(m.price) as zisk from food f, all_orders ao, menu m, canteen c where ao.menu_id = m.id and ao.canteen_id = c.id and m.food_id = f.id and m.date >= now() - interval '7' day group by f.name order by pocet desc limit 5"
        cursor.execute(postgres_select_query2)
        connection.commit()
        df2 = DataFrame(cursor.fetchall(), columns=[
                       'Food', 'Count sold', ' Food profit'])
        df2.to_csv(fpReportFood, sep='\t', encoding='utf-8')
        logging.info(df2)
    except (Exception, psycopg2.Error) as error:
        logging.info("Failed to select records from DB ")
        logging.info(error)

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()
            logging.info("PostgreSQL connection is closed")

    blob_url_canteens = None
    blob_url_foods = None
# blob storage canteens
    try:
        blob = BlobClient.from_connection_string(
            conn_str="DefaultEndpointsProtocol=https;AccountName=functionappscloudy;AccountKey=yKLgiGWscrpY6HlW0UxNMESivlO6vHStxmrZE5nsnBHMjcVfwPA9rxOVviFESXCZy2mGiaPFSOzMsKOPjWr4WQ==;EndpointSuffix=core.windows.net",
            container_name="upjs-reports",
            blob_name="upjs-report-canteens.csv")
        #  upload the created file
        with open(fpReportCanteens.name, "rb") as data:
            blob.upload_blob(data, overwrite=True)
            blob_url_canteens = blob.url
    except Exception as ex:
        logging.info('Exception:')
        logging.info(ex)

    # blob storage foods
    try:
        blob = BlobClient.from_connection_string(
            conn_str="DefaultEndpointsProtocol=https;AccountName=functionappscloudy;AccountKey=yKLgiGWscrpY6HlW0UxNMESivlO6vHStxmrZE5nsnBHMjcVfwPA9rxOVviFESXCZy2mGiaPFSOzMsKOPjWr4WQ==;EndpointSuffix=core.windows.net",
            container_name="upjs-reports",
            blob_name="upjs-report-food.csv")
        #  upload the created file
        with open(fpReportFood.name, "rb") as data:
            blob.upload_blob(data, overwrite=True)
            blob_url_foods = blob.url
    except Exception as ex:
        logging.info('Exception:')
        logging.info(ex)

    # send receipt to user email
    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = "canteen.uni@gmail.com"
    password = "hnypsbskihxjmeuk"
    context = ssl.create_default_context()
    SUBJECT_ADMIN = "UniCanteen: Your reports are available"
    TEXT_ADMIN = "Hello UPJS admin! Weekly reports have been generated. You can start analysing after downloading them. Click on this link to see weekly report by canteen: " + blob_url_canteens + " Click on this link to see top selling foods this week: " + blob_url_foods + " UniCanteen Team"
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()
        # Secure the connection using the tls protocol
        server.starttls(context=context)
        server.login(sender_email, password)
        message_admin = 'Subject: {}\n\n{}'.format(
            SUBJECT_ADMIN, TEXT_ADMIN)
        server.sendmail(sender_email, adminEmail, message_admin)
    except Exception as e:
        logging.info("Failed to send emails")
    finally:
        server.quit()

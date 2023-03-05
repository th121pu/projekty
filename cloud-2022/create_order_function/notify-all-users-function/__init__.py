import logging
import json
import psycopg2
import smtplib
import ssl
import azure.functions as func


def main(message: func.ServiceBusMessage):
    message_body = message.get_body().decode("utf-8")

    # logging.info("Python ServiceBus topic trigger processed message.")
    # logging.info(message_body)

    # convert string to  object
    json_object = json.loads(message_body)
    tenant = json_object["tenant"]
    message_to_send = json_object["message"]
    canteenEmail = json_object["canteenEmail"]

    optionsString = "-c search_path=" + tenant
    recipients = []

    #  get user emails from DB
    try:
        connection = psycopg2.connect(host="uni-canteen.postgres.database.azure.com",
                                      database="postgres",
                                      user="cloud_tuke",
                                      password="Heslo123tuke",
                                      options=optionsString)
        cursor = connection.cursor()
        cursor.execute(
            "SELECT alternative_email FROM user_object WHERE role='STUDENT'")
        all_user_emails = cursor.fetchall()
        for x in range(len(all_user_emails)):
            if (all_user_emails[x][0]) is not None:
                print(all_user_emails[x][0])
                recipients.append(all_user_emails[x][0])
        # logging.info(recipients)

    except (Exception, psycopg2.Error) as error:
        logging.info("Failed to select records from user_object table ")

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()
            # logging.info("PostgreSQL connection is closed")

    #  send emails
    smtp_server = "smtp.gmail.com"
    port = 587
    sender_email = canteenEmail
    password = "hnypsbskihxjmeuk"
    context = ssl.create_default_context()
    SUBJECT = "UniCanteen: IMPORTANT NOTIFICATION"
    TEXT = message_to_send.replace('"', '')
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()  # Can be omitted
        # Secure the connection using the tls protocol
        server.starttls(context=context)
        server.login(sender_email, password)
        message = 'Subject: {}\n\n{}'.format(SUBJECT, TEXT)
        for x in range(len(recipients)):
            server.sendmail(sender_email, recipients[x], message)
    except Exception as e:
        print(e)
    finally:
        server.quit()

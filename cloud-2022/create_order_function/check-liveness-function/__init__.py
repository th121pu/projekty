import datetime
import logging
import psycopg2
from pandas import DataFrame
import smtplib
import ssl
import requests
import json

import azure.functions as func


def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()
    optionsString = "-c search_path=tuke_canteens"

# chech DB liveness
    try:
        connection = psycopg2.connect(host="uni-canteen.postgres.database.azure.com",
                                      database="postgres",
                                      user="cloud_tuke",
                                      password="Heslo123tuke",
                                      options=optionsString)
        cursor = connection.cursor()
        postgres_select_query = "select c.name as nazov_kantiny from canteen c;"
        cursor.execute(postgres_select_query)
        connection.commit()
        canteen_name = cursor.fetchone()
    except (Exception, psycopg2.Error) as error:
        logging.info("Failed to select records from DB")
        logging.info(error)
        sendEmailToAdmin("DB is not working")

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()
            logging.info("PostgreSQL connection is closed")

# chech FE liveness
    response = requests.get('https://uni-canteen.web.app/')
    if response.status_code != 200:
        sendEmailToAdmin("FE is not working")

    test_object = {
        "displayName": "dOMINIKA e",
        "mail": None,
        "userPrincipalName": "Toma nwm",
        "id": "testttttttttttttttt",
        "tenantId": "91805668-f79d-4291-8f91-77f842032c20",
        "roleId": "b6104f4c-1d63-4244-b57e-7c50662ccb19"
    }

    test_header = {'content-type': 'application/json', 'tenantId': '91805668-f79d-4291-8f91-77f842032c20'}

# chech BE liveness
    r = requests.post("https://uni-canteen-backend.azurewebsites.net/user/verifyUser", data=json.dumps(test_object), headers=test_header)
    if r.status_code != 200:
        sendEmailToAdmin("BE is not working")


def sendEmailToAdmin(error_message):
    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = "canteen.uni@gmail.com"
    adminEmail = "tomas.halgas11@gmail.com"
    password = "hnypsbskihxjmeuk"
    context = ssl.create_default_context()
    SUBJECT_ADMIN = "UniCanteen: Component not alive"
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()
        # Secure the connection using the tls protocol
        server.starttls(context=context)
        server.login(sender_email, password)
        message_admin = 'Subject: {}\n\n{}'.format(
            SUBJECT_ADMIN, error_message)
        server.sendmail(sender_email, adminEmail, message_admin)
    except Exception as e:
        logging.info("Failed to send emails")
    finally:
        server.quit()

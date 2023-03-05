import logging
import smtplib, ssl
import json
import azure.functions as func


def main(message: func.ServiceBusMessage):
    message_body = message.get_body().decode("utf-8")

    # logging.info("Python ServiceBus topic trigger processed message.")
    # logging.info(message_body)

    # convert string to  object
    json_object = json.loads(message_body)
    orderId = json_object["orderId"]
    studentEmail = json_object["studentEmail"]
    canteenEmail = json_object["canteenEmail"]

    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = "canteen.uni@gmail.com"
    password = "hnypsbskihxjmeuk"
    context = ssl.create_default_context()
    SUBJECT_STUDENT = "UniCanteen: Your order"
    TEXT_STUDENT = "Hello! Your order has been successfully placed and will be ready in no time! UniCanteen Team"
    SUBJECT_CANTEEN = "UniCanteen: New order"
    TEXT_CANTEEN = "Hello! New order with id " + str(orderId) + " has been placed for your canteen. UniCanteen Team"

    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()
        server.starttls(context=context)  # Secure the connection using the tls protocol
        server.login(sender_email, password)
        message_student = 'Subject: {}\n\n{}'.format(SUBJECT_STUDENT, TEXT_STUDENT)
        server.sendmail(sender_email, studentEmail, message_student)
        message_canteen = 'Subject: {}\n\n{}'.format(SUBJECT_CANTEEN, TEXT_CANTEEN)
        server.sendmail(sender_email, canteenEmail, message_canteen)
    except Exception as e:
        logging.info("Failed to send emails")
    finally:
        server.quit()
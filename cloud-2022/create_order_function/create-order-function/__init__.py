import json
import logging
import psycopg2

import azure.functions as func

from azure.servicebus import ServiceBusClient, ServiceBusMessage


def main(message: func.ServiceBusMessage):
    # Log the Service Bus Message as plaintext

    CONNECTION_STR = "Endpoint=sb://dominika-cloudy.servicebus.windows.net/;SharedAccessKeyName" \
                     "=RootManageSharedAccessKey;SharedAccessKey=rkO6KlNGRjFcJWyq5O9siZWQhSg7wr+hbkWGdyBKy0M= "
    TOPIC_NAME = "new-order-added"

    message_body = message.get_body().decode("utf-8")

    # logging.info("Python ServiceBus topic trigger processed message.")
    # logging.info(message_body)

    # convert string to  object
    json_object = json.loads(message_body)
    userId = json_object["userId"]
    canteenId = json_object["canteenId"]
    menuId = json_object["menuId"]
    prepaid = (json_object["prepaid"])
    picked = (json_object["picked"])
    currentTenant = json_object["currentTenant"]
    studentEmail = json_object["studentEmail"]
    canteenEmail = json_object["canteenEmail"]
    optionsString = "-c search_path=" + currentTenant

    try:
        connection = psycopg2.connect(host="uni-canteen.postgres.database.azure.com",
                                      database="postgres",
                                      user="cloud_tuke",
                                      password="Heslo123tuke",
                                      options=optionsString)
        cursor = connection.cursor()
        postgres_insert_query = "INSERT INTO all_orders (user_object_id, canteen_id, menu_id, prepaid, picked) VALUES (%s,%s,%s,%s,%s) RETURNING id;"
        cursor.execute(postgres_insert_query, (
            userId, canteenId, menuId, bool(prepaid), bool(picked)))
        connection.commit()
        new_order_id = cursor.fetchone()[0]
        # logging.info("Record inserted successfully into all_orders table, with id : " + str (new_order_id))

    except (Exception, psycopg2.Error) as error:
        logging.info("Failed to insert record into all_orders table ")

    finally:
        # closing database connection.
        if connection:
            cursor.close()
            connection.close()
            # logging.info("PostgreSQL connection is closed")

    jsonMessageToSend = {
        "orderId": new_order_id,
        "studentEmail": studentEmail,
        "canteenEmail": canteenEmail
    }
    strMessageToSend = json.dumps(jsonMessageToSend)

    # create a Service Bus client using the connection string
    servicebus_client = ServiceBusClient.from_connection_string(
        conn_str=CONNECTION_STR, logging_enable=True)
    with servicebus_client:
        # get a Queue Sender object to send messages to the queue
        sender = servicebus_client.get_topic_sender(topic_name=TOPIC_NAME)
        with sender:
            # create a Service Bus message
            message = ServiceBusMessage(strMessageToSend)
            # send the message to the topic
            sender.send_messages(message)

import psycopg2

from db_setup.config import config
from fillDB import fillDB
from getNewData import get_new_data
from pricePrediction import make_price_prediction


def connect():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        # execute a statement
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')

        # display the PostgreSQL database server version
        db_version = cur.fetchone()
        print(db_version)

        # make a price prediction, 3 INT argumenty, 1. = crypto_id, 2. = kolko 10 min intervalov berie ako 1 interval
        # a 3. je kolko zvolenych intervalov do buducnosti to predikuje cenu. interval je 10 min u btc a 1 hod inde.
        #make_price_prediction(conn, cur, 1, 1, 25920) #btc 25920 10 minutovych intervalov dopredu
        #make_price_prediction(conn, cur, 2, 1, 4320)  #eth 4320 hodinovych intervalov dopredu
        #make_price_prediction(conn, cur, 3, 1, 4320)  #bnb 4320 hodinovych intervalov dopredu
        
        # add historical data to DB
        fillDB(conn, cur)

        # CLOSE the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


if __name__ == '__main__':
    connect()
    #get_new_data()


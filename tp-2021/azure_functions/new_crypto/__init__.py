import datetime
import logging

import azure.functions as func

import psycopg2
import requests

apikeys = [
    '7314D0FA-B7A8-4321-BE3C-628E68B5954A',  # new1
    'B473D3A0-2147-4029-B367-325D07D7C929',  # new2
]


def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    get_new_data()
    logging.info('Python timer trigger function ran at %s', utc_timestamp)


def get_new_data():
    # add new data from API every hour
    conn = None

    try:
        logging.info('GND Connecting to the PostgreSQL database...')
        conn = psycopg2.connect("host=npakmavs.postgres.database.azure.com dbname=postgres user=npakmavs password=TP2021##")
        cur = conn.cursor()

        # # BITCOIN
        # url = 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_EUR/latest?period_id=10MIN&limit=1'
        # response = requests.get(url, headers=headers)
        # save_to_db(response.json(), conn, 1, False)

        headers = {'X-CoinAPI-Key': apikeys[0]}

        # ETHEREUM
        url = 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_ETH_EUR/latest?period_id=1HRS&limit=1'
        response = requests.get(url, headers=headers)
        save_to_db(response.json(), conn, 2, False)

        headers = {'X-CoinAPI-Key': apikeys[1]}

        # BINANCE v USD
        url = 'https://rest.coinapi.io/v1/ohlcv/COINSBIT_SPOT_BNB_USD/latest?period_id=1HRS&limit=1'
        response = requests.get(url, headers=headers)
        save_to_db(response.json(), conn, 3, True)

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        logging.info(error)
    finally:
        if conn is not None:
            conn.close()
            logging.info('GND Database connection closed.')


def save_to_db(result, conn, crypto_type, convert_to_eur):
    exchange_rate = 0.89
    for f in result:
        price_open = None
        price_high = None
        price_low = None
        price_close = None
        if f.get('price_open'):
            price_open = f.get('price_open')
        if f.get('price_high'):
            price_high = f.get('price_high')
        if f.get('price_low'):
            price_low = f.get('price_low')
        if f.get('price_close'):
            price_close = f.get('price_close')
        if convert_to_eur:
            price_open = price_open * exchange_rate
            price_high = price_high * exchange_rate
            price_low = price_low * exchange_rate
            price_close = price_close * exchange_rate
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO crypto (time_period_start, time_period_end, time_open,time_close,price_open,price_high, price_low,price_close,volume_traded,trades_count,crypto_type_id) "
            "VALUES( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (f.get('time_period_start'), f.get('time_period_end'), f.get('time_open'), f.get('time_close'),
             price_open, price_high, price_low, price_close, f.get('volume_traded'),
             f.get('trades_count'), crypto_type))
        conn.commit()

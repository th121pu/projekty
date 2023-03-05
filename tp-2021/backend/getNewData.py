import json
import requests
import psycopg2
from db_setup.config import config
import threading

apikeys = [
    '97BF28D3-A90B-454F-9C41-00AAD22353AB',  # dominika1
    '6CF064C7-3E80-417D-97B8-2DD151ACE0F9'  # dominika2
]


def get_new_data():
    # add new data from API every 10 minutes
    threading.Timer(600, get_new_data).start()
    conn = None

    try:
        params = config()
        print('GND Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        cur = conn.cursor()

        # vytvorenie novej tabulky pre latest data, user, user_cutrrency
        # sql_file = open("db_setup/db_objects2.sql")
        # sql_as_string = sql_file.read()
        # cur.execute(sql_as_string)
        # conn.commit()

        headers = {'X-CoinAPI-Key': apikeys[1]}

        # BITCOIN
        file = open('api_results/btc/latest.txt', 'w')
        url = 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_EUR/latest?period_id=10MIN&limit=1'
        response = requests.get(url, headers=headers)
        json.dump(response.json(), file)

        # ETHEREUM
        file = open('api_results/eth/latest.txt', 'w')
        url = 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_ETH_EUR/latest?period_id=10MIN&limit=1'
        response = requests.get(url, headers=headers)
        json.dump(response.json(), file)

        # BINANCE v USD
        file = open('api_results/bnb/latest.txt', 'w')
        url = 'https://rest.coinapi.io/v1/ohlcv/COINSBIT_SPOT_BNB_USD/latest?period_id=10MIN&limit=1'
        response = requests.get(url, headers=headers)
        json.dump(response.json(), file)

        # ADDING DATA TO DATABASE
        file = open('api_results/btc/latest.txt', 'r')
        result = json.load(file)
        save_to_db(result, conn, 1, False)

        file = open('api_results/eth/latest.txt', 'r')
        result = json.load(file)
        save_to_db(result, conn, 2, False)

        file = open('api_results/bnb/latest.txt', 'r')
        result = json.load(file)
        save_to_db(result, conn, 3, True)

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('GND Database connection closed.')


def save_to_db(result, conn, crypto_type, convert_to_eur):
    exchange_rate = 0.86
    print(result)
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
            "INSERT INTO new_crypto (time_period_start, time_period_end, time_open,time_close,price_open,price_high, price_low,price_close,volume_traded,trades_count,crypto_type_id) "
            "VALUES( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (f.get('time_period_start'), f.get('time_period_end'), f.get('time_open'), f.get('time_close'),
             price_open, price_high, price_low, price_close, f.get('volume_traded'),
             f.get('trades_count'), crypto_type))
        conn.commit()


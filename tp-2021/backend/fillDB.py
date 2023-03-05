import json
import requests

# import pandas_datareader as web
# import yfinance as yf
# import datetime as dt


apikeys = [
    '6FD78027-4991-42CF-BFC6-B9BB4E920D1D',  # tomas1
    'A1739DCB-3156-440F-AA5A-9750535E6241',  # tomas2
    'B7922CB8-71B0-404C-BAEC-418604C7D747',  # tomas3
    'CAC6051E-EA12-4527-A622-D14548C8E61A',  # tomas4
    '06E281AA-CA82-4A9D-B562-0F3E42BC0874',  # tomas5
    '54D21D60-B2ED-402F-8F70-8A48251F116F',  # dejan1
]


def fillDB(conn, cur):
    # --------------------------------------------------------------------------------
    # ------------------------- ZISKANIE DAT Z API -----------------------------------
    # --------------------------------------------------------------------------------
    # 2 mesiace su cca 9000 udajov -> max 4 mesiace denne na 1 api kluc
    headers = {'X-CoinAPI-Key': apikeys[3]}

    # VZOR REQUESTOV PRE JEDNOTLIVE TYPY COINOV
    # --Bitcoin--
    # file = open('api_results/btc/2020-01-01.txt', 'w')
    # url = 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_EUR/history?period_id=10MIN&time_start=2020-01-01T00:00' \
    #       ':00&time_end=2020-03-01T00:00:00&limit=9000&include_empty_items=true'
    # response = requests.get(url, headers=headers)
    # print(response.json())
    # json.dump(response.json(), file)

    # --Ethereum--
    # file = open('api_results/eth/2020-01-01.txt', 'w')
    # url = 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_ETH_EUR/history?period_id=10MIN&time_start=2020-01-01T00:00' \
    #       ':00&time_end=2020-03-01T00:00:00&limit=9000&include_empty_items=true'
    # response = requests.get(url, headers=headers)
    # print(response.json())
    # json.dump(response.json(), file)

    # --Binance Coin v dolaroch--
    # file = open('api_results/bnb/2020-01-01USD.txt', 'w')
    # url = 'https://rest.coinapi.io/v1/ohlcv/COINSBIT_SPOT_BNB_USD/history?period_id=10MIN&time_start=2020-01-01T00:00' \
    #       ':00&time_end=2020-03-01T00:00:00&limit=9000&include_empty_items=true'
    # response = requests.get(url, headers=headers)
    # print(response.json())
    # json.dump(response.json(), file)

    # REQUESTY

    # --------------------------------------------------------------------------------
    # ------------------------- NAPLNENIE TABULIEK -----------------------------------
    # --------------------------------------------------------------------------------
    #
    # file = open('api_results/bnb/2019-01-01.txt', 'r')
    # result = json.load(file)
    # saveToDb(result, conn, 3)

    # file = open('api_results/bnb/2019-03-01.txt', 'r')
    # result = json.load(file)
    # saveToDb(result, conn, 3)

    # file = open('api_results/bnb/2019-05-01.txt', 'r')
    # result = json.load(file)
    # saveToDb(result, conn, 3)
    #
    # file = open('api_results/bnb/2019-07-01.txt', 'r')
    # result = json.load(file)
    # saveToDb(result, conn, 3)
    #
    # file = open('api_results/bnb/2019-09-01.txt', 'r')
    # result = json.load(file)
    # saveToDb(result, conn, 3)
    #
    # file = open('api_results/bnb/2019-11-01.txt', 'r')
    # result = json.load(file)
    # saveToDb(result, conn, 3)

    # -------------------- USD TO EUR --------------------
    # file = open('api_results/bnb/2021-01-01USD.txt', 'r')
    # result = json.load(file)
    # saveToDbUSD(result, conn, 3)
    #
    # file = open('api_results/bnb/2021-03-01USD.txt', 'r')
    # result = json.load(file)
    # saveToDbUSD(result, conn, 3)
    #
    # file = open('api_results/bnb/2021-05-01USD.txt', 'r')
    # result = json.load(file)
    # saveToDbUSD(result, conn, 3)
    #
    # file = open('api_results/bnb/2021-07-01USD.txt', 'r')
    # result = json.load(file)
    # saveToDbUSD(result, conn, 3)

    # file = open('api_results/bnb/2020-09-01USD.txt', 'r')
    # result = json.load(file)
    # saveToDbUSD(result, conn, 3)
    #
    # file = open('api_results/bnb/2020-11-01USD.txt', 'r')
    # result = json.load(file)
    # saveToDbUSD(result, conn, 3)

    # SKUSKA ZISKANIE DAT V PANDAS FORMATE
    # start = dt.datetime(2018, 1, 1)
    # end = dt.datetime.now()
    #
    # # ltc = web.DataReader('BTC-USD', 'yahoo', start, end)
    #
    # eth = yf.download('ETH-EUR', start, end)
    # print(eth)
    # eth.to_csv('test')


def saveToDb(result, conn, crypto_type):
    for f in result:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO crypto (time_period_start, time_period_end, time_open,time_close,price_open,price_high, price_low,price_close,volume_traded,trades_count,crypto_type_id) "
            "VALUES( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (f.get('time_period_start'), f.get('time_period_end'), f.get('time_open'), f.get('time_close'),
             f.get('price_open'), f.get('price_high'), f.get('price_low'), f.get('price_close'), f.get('volume_traded'),
             f.get('trades_count'), crypto_type))
        conn.commit()


def saveToDbUSD(result, conn, crypto_type):
    # USD TO EUR 2019: 0.89
    # USD TO EUR 2020 01-06: 0.9
    # USD TO EUR 2020 07-12: 0.85
    # USD TO EUR 2021: 0.84

    convToEUR = 0.84
    for f in result:
        price_open = None
        price_high = None
        price_low = None
        price_close = None
        if f.get('price_open'):
            price_open = f.get('price_open') * convToEUR
        if f.get('price_high'):
            price_high = f.get('price_high') * convToEUR
        if f.get('price_low'):
            price_low = f.get('price_low') * convToEUR
        if f.get('price_close'):
            price_close = f.get('price_close') * convToEUR

        cur = conn.cursor()
        cur.execute(
            "INSERT INTO crypto (time_period_start, time_period_end, time_open,time_close,price_open,price_high, price_low,price_close,volume_traded,trades_count,crypto_type_id) "
            "VALUES( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (f.get('time_period_start'), f.get('time_period_end'), f.get('time_open'), f.get('time_close'),
             price_open, price_high, price_low, price_close, f.get('volume_traded'),
             f.get('trades_count'), crypto_type))
        conn.commit()

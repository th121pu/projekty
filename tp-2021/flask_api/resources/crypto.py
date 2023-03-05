import datetime

from flask import request
from flask_restful import Resource

from models import Crypto, CryptoPrediction


class CryptoModel(Resource):
    def get(self):
        return {'items': list(map(lambda x: x.json(), Crypto.query.all()))}


def create_json(resultX):
    results = []
    for result in resultX:
        results.append(result.toJson())
    return results


def get_change(current, previous):
    if current == previous:
        return 0
    try:
        return ((current - previous) / previous) * 100.0
    except ZeroDivisionError:
        return float('inf')


class LatestCurrencyValue(Resource):
    def get(self):
        exchange_rate = 1
        world_currency = request.args.get('world_currency')
        print("World currency: ", world_currency)
        if world_currency == "USD" or world_currency == "usd":
            exchange_rate = 1.13
        print("exchange rate is ", exchange_rate)
        result_list = []
        latest_bitcoin = Crypto.find_by_id(1)
        latest_ethereum = Crypto.find_by_id(2)
        latest_binance = Crypto.find_by_id(3)
        today = datetime.datetime.utcnow()
        if latest_bitcoin:
            time_to_subtract = 12
            final_time = today - datetime.timedelta(hours=time_to_subtract)
            bitcoin_result = Crypto.find_by_id_and_interval(1, today, final_time)
            btc_format = []
            btc_format_unchanged = []
            for b in bitcoin_result:
                btc_format.append(b.price_close * exchange_rate)
                btc_format_unchanged.append(b.price_close)
            # 24h and week historical data
            day_ago = today - datetime.timedelta(hours=24)
            day_agoo = today - datetime.timedelta(hours=25)
            price_day_ago = Crypto.find_by_id_and_interval(1, day_ago, day_agoo)
            btc_format_day_ago = []
            for price in price_day_ago:
                btc_format_day_ago.append(price.price_close)
            change24h = get_change(btc_format_unchanged[-1], btc_format_day_ago[-1])
            # week
            week_ago = today - datetime.timedelta(hours=168)
            week_agoo = today - datetime.timedelta(hours=170)
            price_week_ago = Crypto.find_by_id_and_interval(1, week_ago, week_agoo)
            btc_format_week_ago = []
            for price in price_week_ago:
                btc_format_week_ago.append(price.price_close)
            change7d = get_change(btc_format_unchanged[-1], btc_format_week_ago[-1])
            # 24h and week predicted data
            next_day = today + datetime.timedelta(hours=24)
            next_dayy = today + datetime.timedelta(hours=23)
            bitcoin_future_result = CryptoPrediction.find_by_id_and_interval(1, next_dayy, next_day)
            btc_format_next_day = []
            for price in bitcoin_future_result:
                btc_format_next_day.append(price.predicted_price_close)
            predicted_change24h = get_change(btc_format_next_day[-1], btc_format_unchanged[-1])
            # week
            next_week = today + datetime.timedelta(hours=168)
            next_weekk = today + datetime.timedelta(hours=167)
            price_next_week = CryptoPrediction.find_by_id_and_interval(1, next_weekk, next_week)
            btc_format_next_week = []
            for price in price_next_week:
                btc_format_next_week.append(price.predicted_price_close)
            predicted_change7d = get_change(btc_format_next_week[-1], btc_format_unchanged[-1])
            result_list.append(latest_bitcoin[0].json2(latest_bitcoin[1], latest_bitcoin[2].strip(),
                                                       btc_format, change24h, change7d, predicted_change24h, predicted_change7d, exchange_rate))
        if latest_ethereum:
            time_to_subtract = 12
            final_time = today - datetime.timedelta(hours=time_to_subtract)
            eth_result = Crypto.find_by_id_and_interval(2, today, final_time)
            eth_format = []
            eth_format_unchanged = []
            for b in eth_result:
                eth_format.append(b.price_close * exchange_rate)
                eth_format_unchanged.append(b.price_close)
            # 24h and week historical data
            day_ago = today - datetime.timedelta(hours=24)
            day_agoo = today - datetime.timedelta(hours=27)
            price_day_ago = Crypto.find_by_id_and_interval(2, day_ago, day_agoo)
            eth_format_day_ago = []
            for price in price_day_ago:
                eth_format_day_ago.append(price.price_close)
            print(eth_format_day_ago)
            change24h = get_change(eth_format_unchanged[-1], eth_format_day_ago[-1])
            week_ago = today - datetime.timedelta(hours=168)
            week_agoo = today - datetime.timedelta(hours=170)
            price_week_ago = Crypto.find_by_id_and_interval(2, week_ago, week_agoo)
            eth_format_week_ago = []
            for price in price_week_ago:
                eth_format_week_ago.append(price.price_close)
            change7d = get_change(eth_format_unchanged[-1], eth_format_week_ago[-1])
            # 24h and week predicted data
            next_day = today + datetime.timedelta(hours=24)
            next_dayy = today + datetime.timedelta(hours=23)
            ethereum_future_result = CryptoPrediction.find_by_id_and_interval(2, next_dayy, next_day)
            eth_format_next_day = []
            for price in ethereum_future_result:
                eth_format_next_day.append(price.predicted_price_close)
            predicted_change24h = get_change(eth_format_next_day[-1], eth_format_unchanged[-1])
            # week
            next_week = today + datetime.timedelta(hours=168)
            next_weekk = today + datetime.timedelta(hours=167)
            price_next_week = CryptoPrediction.find_by_id_and_interval(2, next_weekk, next_week)
            eth_format_next_week = []
            for price in price_next_week:
                eth_format_next_week.append(price.predicted_price_close)
            predicted_change7d = get_change(eth_format_next_week[-1], eth_format_unchanged[-1])
            result_list.append(
                latest_ethereum[0].json2(latest_ethereum[1], latest_ethereum[2].strip(), eth_format, change24h,
                                         change7d, predicted_change24h, predicted_change7d, exchange_rate))
        if latest_binance:
            time_to_subtract = 12
            final_time = today - datetime.timedelta(hours=time_to_subtract)
            bnb_result = Crypto.find_by_id_and_interval(3, today, final_time)
            bnb_format = []
            bnb_format_unchanged = []
            for b in bnb_result:
                bnb_format.append(b.price_close * exchange_rate)
                bnb_format_unchanged.append(b.price_close)
            subtract_day = 24
            day_ago = today - datetime.timedelta(hours=subtract_day)
            day_agoo = today - datetime.timedelta(hours=25)
            price_day_ago = Crypto.find_by_id_and_interval(3, day_ago, day_agoo)
            bnb_format_day_ago = []
            for price in price_day_ago:
                bnb_format_day_ago.append(price.price_close)
            change24h = get_change(bnb_format_unchanged[-1], bnb_format_day_ago[-1])
            subtract_week = 168
            week_ago = today - datetime.timedelta(hours=subtract_week)
            week_agoo = today - datetime.timedelta(hours=170)
            price_week_ago = Crypto.find_by_id_and_interval(3, week_ago, week_agoo)
            bnb_format_week_ago = []
            for price in price_week_ago:
                bnb_format_week_ago.append(price.price_close)
            change7d = get_change(bnb_format_unchanged[-1], bnb_format_week_ago[-1])
            # 24h and week predicted data
            next_day = today + datetime.timedelta(hours=24)
            next_dayy = today + datetime.timedelta(hours=23)
            binance_future_result = CryptoPrediction.find_by_id_and_interval(3, next_dayy, next_day)
            bnb_format_next_day = []
            for price in binance_future_result:
                bnb_format_next_day.append(price.predicted_price_close)
            predicted_change24h = get_change(bnb_format_next_day[-1], bnb_format_unchanged[-1])
            print(bnb_format_next_day[-1])
            print("rozdiel")
            print(predicted_change24h)
            # week
            next_week = today + datetime.timedelta(hours=168)
            next_weekk = today + datetime.timedelta(hours=167)
            price_next_week = CryptoPrediction.find_by_id_and_interval(3, next_weekk, next_week)
            print(price_next_week)
            bnb_format_next_week = []
            for price in price_next_week:
                bnb_format_next_week.append(price.predicted_price_close)
            print("price in a week")
            print(bnb_format_next_week[-1])
            predicted_change7d = get_change(bnb_format_next_week[-1], bnb_format_unchanged[-1])
            print("rozdiel za tyzden")
            print(predicted_change7d)
            result_list.append(
                latest_binance[0].json2(latest_binance[1], latest_binance[2].strip(), bnb_format, change24h, change7d,
                                        predicted_change24h, predicted_change7d, exchange_rate))

        if len(result_list) > 0:
            return result_list
        return {'message': 'Currency not found'}, 404

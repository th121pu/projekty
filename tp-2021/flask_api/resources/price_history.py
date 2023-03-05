import datetime

from flask import request
from flask_restful import Resource

from models import Crypto
from resources.crypto_prediction import PredictionModel


def create_json(resultX, exchange_rate):
    results = []
    for result in resultX:
        # if idx != 0:
        #     result.price_open = resultX[idx-1].price_close
        results.append(result.json3("historical price", exchange_rate))
    return results


class CurrencyPriceFilterModel(Resource):
    def get(self):
        exchange_rate = 1
        currency = int(request.args.get('currency'))
        interval = request.args.get('interval')
        world_currency = request.args.get('world_currency')
        today = datetime.datetime.utcnow()
        print("World currency: ", world_currency)
        if world_currency == "USD" or world_currency == "usd":
            exchange_rate = 1.13
        print("exchange rate is ", exchange_rate)
        print("currency: ", currency)
        print("interval: ", interval)
        print("Today's date:", today)
        # BITCOIN
        if currency == 1:
            if interval == "10MIN":
                time_to_subtract = 12
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (12 hours ahead of today ): ', final_time)
                bitcoin_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    result = create_json(bitcoin_result, exchange_rate)
                    return result + result_prediction
            if interval == "1HRS":
                time_to_subtract = 168
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (7 days ahead of today ): ', final_time)
                bitcoin_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result = create_json(bitcoin_result, exchange_rate)
                    result_every_sixth_element = result[::6]
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_sixth_element + result_prediction
            if interval == "12HRS":
                time_to_subtract = 720
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (30 days ahead of today ): ', final_time)
                bitcoin_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result = create_json(bitcoin_result, exchange_rate)
                    result_every_72_element = result[::72]
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_72_element + result_prediction
            if interval == "1DAY":
                time_to_subtract = 4032
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (Half a year ahead of today ): ', final_time)
                bitcoin_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result = create_json(bitcoin_result, exchange_rate)
                    result_every_144_element = result[::144]
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_144_element + result_prediction
            if interval == "1WKS":
                time_to_subtract = 24000
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (1000 days ahead of today ): ', final_time)
                bitcoin_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result = create_json(bitcoin_result, exchange_rate)
                    result_every_1008_element = result[::1008]
                    #result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_1008_element
        # ETHEREUM
        if currency == 2:
            if interval == "1HRS":
                time_to_subtract = 168
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (7 days ahead of today ): ', final_time)
                ethereum_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if ethereum_result:
                    result = create_json(ethereum_result, exchange_rate)
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result + result_prediction
            if interval == "12HRS":
                time_to_subtract = 720
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (30 days ahead of today ): ', final_time)
                ethereum_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if ethereum_result:
                    result = create_json(ethereum_result, exchange_rate)
                    result_every_12_element = result[::12]
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_12_element + result_prediction
            if interval == "1DAY":
                time_to_subtract = 4032
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (Half a year ahead of today ): ', final_time)
                ethereum_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if ethereum_result:
                    result = create_json(ethereum_result, exchange_rate)
                    result_every_24_element = result[::24]
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_24_element + result_prediction
            if interval == "1WKS":
                time_to_subtract = 24000
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (1000 days ahead of today ): ', final_time)
                ethereum_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if ethereum_result:
                    result = create_json(ethereum_result, exchange_rate)
                    result_every_168_element = result[::168]
                   #result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_168_element
        # BINANCE COIN
        if currency == 3:
            if interval == "1HRS":
                time_to_subtract = 168
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (7 days ahead of today ): ', final_time)
                binance_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if binance_result:
                    result = create_json(binance_result, exchange_rate)
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result + result_prediction
            if interval == "12HRS":
                time_to_subtract = 720
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (30 days ahead of today ): ', final_time)
                binance_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if binance_result:
                    result = create_json(binance_result, exchange_rate)
                    result_every_12_element = result[::12]
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_12_element + result_prediction
            if interval == "1DAY":
                time_to_subtract = 4032
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (Half a year ahead of today ): ', final_time)
                binance_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if binance_result:
                    result = create_json(binance_result, exchange_rate)
                    result_every_24_element = result[::24]
                    result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_24_element + result_prediction
            if interval == "1WKS":
                time_to_subtract = 16320
                final_time = today - datetime.timedelta(hours=time_to_subtract)
                print('Final Time (1000 days ahead of today ): ', final_time)
                binance_result = Crypto.find_by_id_and_interval(currency, today, final_time)
                if binance_result:
                    result = create_json(binance_result, exchange_rate)
                    result_every_168_element = result[::168]
                    #result_prediction = PredictionModel.get_prediction(currency, interval, exchange_rate)
                    return result_every_168_element

            return {'message': 'History price not found'}, 404

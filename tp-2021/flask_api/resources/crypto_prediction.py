import datetime

from flask import request
from flask_restful import Resource

from models import CryptoPrediction


def create_json(resultX, exchange_rate):
    results = []
    for result in resultX:
        results.append(result.json3("predicted price", exchange_rate))
    return results


class PredictionModel(Resource):
    def get_prediction(currency, interval, exchange_rate):
        # currency = int(request.args.get('currency'))
        # interval = request.args.get('interval')
        today = datetime.datetime.utcnow()
        #world_currency = request.args.get('world_currency')
        print(" CP /// exchange rate is ", exchange_rate)
        print("currency: ", currency)
        print("interval: ", interval)
        print("Today's date:", today)
        # BITCOIN
        if currency == 1:
            if interval == "10MIN":
                time_to_subtract = 12
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (12 hours in the future ): ', final_time)
                bitcoin_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result = create_json(bitcoin_result, exchange_rate)
                    return result
            if interval == "1HRS":
                time_to_subtract = 168
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (7 days in the future ): ', final_time)
                bitcoin_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result = create_json(bitcoin_result, exchange_rate)
                    result_every_sixth_element = result[::6]
                    return result_every_sixth_element
            if interval == "12HRS":
                time_to_subtract = 720
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (30 days in the future ): ', final_time)
                bitcoin_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result = create_json(bitcoin_result, exchange_rate)
                    result_every_72_element = result[::72]
                    return result_every_72_element
            if interval == "1DAY":
                time_to_subtract = 4032
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (Half a year in the future ): ', final_time)
                bitcoin_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if bitcoin_result:
                    result = create_json(bitcoin_result, exchange_rate)
                    result_every_144_element = result[::144]
                    return result_every_144_element
        # ETHEREUM
        if currency == 2:
            if interval == "1HRS":
                time_to_subtract = 168
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (7 days in the future ): ', final_time)
                ethereum_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if ethereum_result:
                    result = create_json(ethereum_result, exchange_rate)
                    return result
            if interval == "12HRS":
                time_to_subtract = 720
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (30 days in the future ): ', final_time)
                ethereum_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if ethereum_result:
                    result = create_json(ethereum_result, exchange_rate)
                    result_every_12_element = result[::12]
                    return result_every_12_element
            if interval == "1DAY":
                time_to_subtract = 4032
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (Half a year in the future ): ', final_time)
                ethereum_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if ethereum_result:
                    result = create_json(ethereum_result, exchange_rate)
                    result_every_24_element = result[::24]
                    return result_every_24_element
        # BINANCE COIN
        if currency == 3:
            if interval == "1HRS":
                time_to_subtract = 168
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (7 days in the future ): ', final_time)
                binance_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if binance_result:
                    result = create_json(binance_result, exchange_rate)
                    return result
            if interval == "12HRS":
                time_to_subtract = 720
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (30 days in the future ): ', final_time)
                binance_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if binance_result:
                    result = create_json(binance_result, exchange_rate)
                    result_every_12_element = result[::12]
                    return result_every_12_element
            if interval == "1DAY":
                time_to_subtract = 4032
                final_time = today + datetime.timedelta(hours=time_to_subtract)
                print('Final Time (Half a year in the future): ', final_time)
                binance_result = CryptoPrediction.find_by_id_and_interval(currency, today, final_time)
                if binance_result:
                    result = create_json(binance_result, exchange_rate)
                    result_every_24_element = result[::24]
                    return result_every_24_element

            return {'message': 'Prediciton price not found'}, 404



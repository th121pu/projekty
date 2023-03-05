from flask_restful import Resource
from models import Crypto


class LastValueCurrencyByIdModel(Resource):
    def get(self, number):
        store = Crypto.find_by_id(number)
        if store:
            return store.json()
        return {'message': 'Store not found'}, 404
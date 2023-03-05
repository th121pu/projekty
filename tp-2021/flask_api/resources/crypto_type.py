from flask_restful import Resource
from models import CryptoType


class CryptoTypeModel(Resource):
    def get(self):
        return {'crypto': list(map(lambda x: x.json(), CryptoType.query.all()))}
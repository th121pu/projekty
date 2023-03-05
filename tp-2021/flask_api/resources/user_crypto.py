from flask_restful import Resource
from models import UserCrypto


class CryptoUserModel(Resource):
    def get(self):
        return {'crypto': list(map(lambda x: x.json(), UserCrypto.query.all()))}
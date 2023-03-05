from flask import Blueprint
from flask_restful import Api
from flask_cors import CORS

from resources.hello import Hello
from resources.app_user import AppUserModel
from resources.crypto import CryptoModel, LatestCurrencyValue
from resources.crypto_prediction import PredictionModel
from resources.crypto_type import CryptoTypeModel
from resources.price_history import CurrencyPriceFilterModel
from resources.user_crypto import CryptoUserModel
from resources.currency import LastValueCurrencyByIdModel
from resources.register_user import RegisterUser
from resources.login_user import LoginUser


api_bp = Blueprint('api', __name__)
CORS(api_bp)
api = Api(api_bp)



# Route localhost/api/
api.add_resource(Hello, '/hello')
api.add_resource(AppUserModel, '/app_users')
api.add_resource(CryptoModel, '/crypto')
# api.add_resource(PredictionModel, '/price_prediction')
api.add_resource(CryptoTypeModel, '/crypto_type')
api.add_resource(LatestCurrencyValue, '/crypto_latest')
api.add_resource(CryptoUserModel, '/crypto_user')
api.add_resource(LastValueCurrencyByIdModel, '/currency/<int:number>')
api.add_resource(CurrencyPriceFilterModel, '/price_history')
api.add_resource(RegisterUser, '/register')
api.add_resource(LoginUser,'/login')



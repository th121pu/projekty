from flask import request
from models import AppUser
from flask_restful import Resource
#from flask_jwt_extended import create_access_token, create_refresh_token
import hashlib


class LoginUser(Resource):
    def post(self):
        try:

            data = request.get_json(force=True)
            print(data)
            current_user = AppUser.query.filter(AppUser.email == data['email']).first()

            if not current_user:
                return {"error": "User not in DB. Register as a new user"}, 404

            password = hashlib.md5(data['password'].encode()).hexdigest()

            if str(current_user.hashed_password) == str(password):
                #  access_token = create_access_token(identity=data['email'])
                #  refresh_token = create_refresh_token(identity=data['email'])
                return {
                    'id': current_user.id,
                    'email': current_user.email,
                    'name': current_user.name,
                    #  'access_token': access_token,
                    #  'refresh_token': refresh_token
                }
            else:
                return {'message': 'User not found'}, 404
        except:
            return {'message': ''
                               'User not found'}, 404

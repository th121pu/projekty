from flask import request
from models import AppUser
from flask_restful import Resource
import hashlib
from models import db
import json


class RegisterUser(Resource):
    def post(self):
        try:

            data = request.get_json(force=True)

            if AppUser.query.filter(AppUser.email == data['email']).first():
                return {"error": "User already exists"}, 404

            register = AppUser(name=data['username'], surname=data['surname'], email=data['email'],
                               hashed_password=hashlib.md5(data['password'].encode()).hexdigest())

            db.session.add(register)
            db.session.commit()

            return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        except:
            return {'message': 'Cannot register'}, 404

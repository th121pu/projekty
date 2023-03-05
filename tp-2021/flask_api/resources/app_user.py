from flask_restful import Resource
from models import AppUser


class AppUserModel(Resource):
    def get(self):
        return {'items': list(map(lambda x: x.json(), AppUser.query.all()))}

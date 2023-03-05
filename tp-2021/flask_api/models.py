# coding: utf-8
import datetime
import json

from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CHAR, Column, DateTime, Float, ForeignKey, Integer, String, text, desc
from sqlalchemy.orm import relationship

ma = Marshmallow()
db = SQLAlchemy()


class AppUser(db.Model):
    __tablename__ = 'app_user'

    id = Column(Integer, primary_key=True, server_default=text("nextval('app_user_id_seq'::regclass)"))
    name = Column(String(255), nullable=False)
    surname = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'surname': self.surname,
            'email': self.id,
            'hashed_password': self.hashed_password
        }

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()


class CryptoType(db.Model):
    __tablename__ = 'crypto_type'

    id = Column(Integer, primary_key=True, server_default=text("nextval('crypto_type_id_seq'::regclass)"))
    name = Column(String(100), nullable=False)
    code = Column(CHAR(100), nullable=False)

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code
        }

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(surname=email).first()

    @classmethod
    def find_by_code(cls, code):
        return cls.query.filter_by(code=code).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()


class Crypto(db.Model):
    __tablename__ = 'crypto'

    id = Column(Integer, primary_key=True, server_default=text("nextval('crypto_id_seq'::regclass)"))
    time_period_start = Column(DateTime, nullable=False)
    time_period_end = Column(DateTime, nullable=False)
    time_open = Column(DateTime)
    time_close = Column(DateTime)
    price_open = Column(Float)
    price_high = Column(Float)
    price_low = Column(Float)
    price_close = Column(Float)
    volume_traded = Column(Float(53))
    trades_count = Column(Integer)
    crypto_type_id = Column(ForeignKey('crypto_type.id'))

    crypto_type = relationship('CryptoType')

    def json(self):
        return {
            'id': self.id,
            'time_period_start': json.dumps(self.time_period_start, cls=DateTimeEncoder),
            'time_period_end': json.dumps(self.time_period_end, cls=DateTimeEncoder),
            'time_open': json.dumps(self.time_open, cls=DateTimeEncoder),
            'time_close': json.dumps(self.time_close, cls=DateTimeEncoder),
            'price_open': self.price_open,
            'price_high': self.price_high,
            'price_low': self.price_low,
            'price_close': self.price_close,
            'volume_traded': self.volume_traded,
            'trades_count': self.trades_count,
            'crypto_type_id': self.crypto_type_id
        }

    def json2(self, name, code, history, change24h, change7d, predicted_change24h, predicted_change7d, exchange_rate):
        return {
            'time_period_end': json.dumps(self.time_close, cls=DateTimeEncoder),
            'price_close': self.price_close * exchange_rate,
            'id': self.crypto_type_id,
            'name': name,
            'code': code,
            'graph': history,
            'lastday': change24h,
            'lastweek': change7d,
            'dayprediction': predicted_change24h,
            'weekprediction': predicted_change7d
        }

    def json3(self, category, exchange_rate):
        close = None
        openp = None
        low = None
        high = None
        if self.price_close is not None:
            close = self.price_close * exchange_rate
        if self.price_open is not None:
            openp = self.price_open * exchange_rate
        if self.price_low is not None:
            low = self.price_low * exchange_rate
        if self.price_high is not None:
            high = self.price_high * exchange_rate

        return {
            'time_period_end': json.dumps(self.time_period_end, cls=DateTimeEncoder),
            'price_close': close,
            'price_open': openp,
            'price_low': low,
            'price_high': high,
            'id': self.crypto_type_id,
            'category': category
        }

    @classmethod
    def find_by_id(cls, number):  # getting the latest value of currency + crypto name and code
        return cls.query.join(CryptoType).add_columns(CryptoType.name, CryptoType.code).filter_by(id=number). \
            order_by(desc(cls.time_period_start)).group_by(cls.crypto_type_id, cls.id, CryptoType.name,
                                                           CryptoType.code).first()

    @classmethod
    def find_by_id_and_interval(cls, currency, today,
                                final_time):  # getting the historical values of currency according to interval
        return cls.query.filter(Crypto.crypto_type_id == currency). \
            filter(Crypto.time_period_end <= today). \
            filter(Crypto.time_period_end >= final_time).order_by(cls.time_period_end).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()


class CryptoPrediction(db.Model):
    __tablename__ = 'crypto_prediction'

    id = Column(Integer, primary_key=True, server_default=text("nextval('crypto_prediction_id_seq'::regclass)"))
    crypto_type_id = Column(ForeignKey('crypto_type.id'))
    time_period_start = Column(DateTime, nullable=False)
    predicted_price_close = Column(Float)

    crypto_type = relationship('CryptoType')

    def json(self):
        return {
            'id': self.id,
            'crypto_type_id': self.crypto_type_id,
            'time_period_start': json.dumps(self.time_period_start, cls=DateTimeEncoder),
            'predicted_price_close': self.predicted_price_close
        }

    def json3(self, category, exchange_rate):
        return {
            'time_period_end': json.dumps(self.time_period_start, cls=DateTimeEncoder),
            'price_close': self.predicted_price_close * exchange_rate,
            'id': self.crypto_type_id,
            'category': category
        }

    @classmethod
    def find_by_id_and_interval(cls, currency, today,
                                final_time):  # getting the predicted values of currency according to interval
        return cls.query.filter(CryptoPrediction.crypto_type_id == currency). \
            filter(CryptoPrediction.time_period_start >= today). \
            filter(CryptoPrediction.time_period_start <= final_time).order_by(cls.time_period_start).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()


class UserCrypto(db.Model):
    __tablename__ = 'user_crypto'

    user_id = Column(ForeignKey('app_user.id'), primary_key=True, nullable=False)
    crypto_type_id = Column(ForeignKey('crypto_type.id'), primary_key=True, nullable=False)
    count = Column(Float(53))

    crypto_type = relationship('CryptoType')
    user = relationship('AppUser')

    def json(self):
        return {
            'user_id': self.user_id,
            'crypto_type_id': self.crypto_type_id,
            'count': self.count
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()


class DateTimeEncoder(json.JSONEncoder):
    def default(self, z):
        if isinstance(z, datetime.datetime):
            return str(z)
        else:
            return super().default(z)

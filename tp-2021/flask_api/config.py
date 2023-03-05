import os

# You need to replace the next values with the appropriate values for your configuration

basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_ECHO = False
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_DATABASE_URI = "postgresql://npakmavs:TP2021##@npakmavs.postgres.database.azure.com/postgres"
    #"postgresql://postgres:svetlana@localhost/flask"
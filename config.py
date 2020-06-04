import os

DEBUG = True
path = os.getcwd()
SQLALCHEMY_DATABASE_URI = os.environ['TODO']
SQLALCHEMY_TRACK_MODIFICATIONS= True
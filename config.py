import os

DEBUG = True

path = os.getcwd()
SQLALCHEMY_DATABASE_URI = 'sqlite:////'+path+'/storage.db'
SQLALCHEMY_TRACK_MODIFICATIONS= True
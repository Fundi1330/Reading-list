import os

# A config file for flask only

SECRET_KEY = os.environ.get('SECRET_KEY')
SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
CORS_URL = 'http://localhost:5173'
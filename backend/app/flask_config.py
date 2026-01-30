import os
from dotenv import load_dotenv

load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '../frontend', '.env')))

# A file with flask config classes for development and production

class DevelmentConfig(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DEBUG = True
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        user = os.environ.get("DB_USER", "")
        password = os.environ.get("DB_PASSWORD", "")
        host = os.environ.get("DB_HOST", "")
        port = os.environ.get("DB_PORT", "")
        dbname = os.environ.get("DB_NAME", "")
        return (
            f"postgresql+psycopg2://{user}:{password}"
            f"@{host}:{port}/{dbname}"
        )
    CORS_URL = os.environ.get('CORS_URL')
    SESSION_PROTECTION = 'strong'
    SESSION_COOKIE_SAMESITE = 'Strict'
    SESSION_COOKIE_HTTPONLY = True # helps prevent xss attacks
    SESSION_COOKIE_SECURE = False # Checks cookies for ssl certificate

class ProductionConfig(DevelmentConfig):
    SESSION_COOKIE_SECURE = True
    DEBUG = False

class TestingConfig(DevelmentConfig):
    DEBUG = False
    TESTING = True
    WTF_CSRF_ENABLED = False
    
    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return 'sqlite://'
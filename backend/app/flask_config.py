import os

# A config file for flask only

SECRET_KEY = os.environ.get('SECRET_KEY')
user = os.environ.get("DB_USER", "")
password = os.environ.get("DB_PASSWORD", "")
host = os.environ.get("DB_HOST", "")
port = os.environ.get("DB_PORT", "")
dbname = os.environ.get("DB_NAME", "")
SQLALCHEMY_DATABASE_URI = (
    f"postgresql+psycopg2://{user}:{password}"
    f"@{host}:{port}/{dbname}"
)
CORS_URL = os.environ.get('CORS_URL')
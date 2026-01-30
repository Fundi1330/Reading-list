import pytest
from app import create_app
from app import db
from os import environ
from app.models import UserModel
from flask_login import login_user, logout_user

@pytest.fixture(scope='session')
def app():
    environ['FLASK_ENV'] = 'TESTING'
    app = create_app()
    app.config.update({
        'SECRET_KEY': 'secret',
    })
    
    yield app

@pytest.fixture(scope='function', autouse=True)
def reset_db(app):
    with app.app_context():
        db.create_all()
        yield
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope='session')
def client(app):
    return app.test_client()
    
@pytest.fixture(scope='session')
def category_ids(client):
    with client:
        resp = client.get('/api/category-ids/')

        return resp.get_json()
import pytest
from app import create_app
from app import db
from os import environ
from app.models import UserModel
from flask_login import login_user, logout_user

@pytest.fixture(scope='session')
def test_user_data():
    return {
        'username': 'test',
        'email': 'test@gmail.com',
        'password': 'Test1234'
    }

@pytest.fixture
def app(test_user_data):
    environ['FLASK_ENV'] = 'TESTING'
    app = create_app()

    with app.app_context():
        db.create_all()
        # Set up a test user
        test_user = UserModel(username=test_user_data['username'], email=test_user_data['email'])
        test_user.hash_and_set_password(test_user_data['password'])
        db.session.add(test_user)
        db.session.commit()
    
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

class AuthActions(object):
    def __init__(self):
        pass

    def login(self, user_id=1):
        user = db.session.get(UserModel, user_id)
        login_user(user, remember=True)

    def logout(self):
        return logout_user()


@pytest.fixture(scope='session')
def auth():
    return AuthActions()
    
@pytest.fixture
def category_ids(client):
    with client:
        resp = client.get('/api/category-ids/')

        return resp.get_json()
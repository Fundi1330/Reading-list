import pytest
from flask_bcrypt import check_password_hash
from app.models import UserModel
from flask_login import current_user, login_remembered, login_user
from app.factories import UserFactory    
from flask import session

def test_sign_up_invalid_password(client):
    # Testing password length
    req_data = {
        'username': 'John Doe',
        'email': 'johndoe@example.com',
        'password': ''
    }
    resp = client.post('/auth/sign-up/', data=req_data)
    resp_data = resp.get_json()

    assert resp.status_code == 400
    assert resp_data['message'] == 'Your password is too short! It should contain at least 8 symbols'

    # Testing capital letters
    req_data['password'] = '12341234'
    resp = resp = client.post('/auth/sign-up/', data=req_data)
    resp_data = resp.get_json()

    assert resp.status_code == 400
    assert resp_data['message'] == 'Your password should have at least one capital letter!'

    # Testing numbers
    req_data['password'] = 'NoNumberHERE'
    resp = resp = client.post('/auth/sign-up/', data=req_data)
    resp_data = resp.get_json()

    assert resp.status_code == 400
    assert resp_data['message'] == 'Your password should contain at least 2 numbers'

def test_sign_up_ununique(client):
    UserFactory(username='John Doe', email='johndoe@example.com')
    user2 = {
        'username': 'Jane Doe',
        'email': 'johndoe@example.com',
        'password': '1234AA1234'
    }
    
    resp = client.post('/auth/sign-up/', data=user2)
    resp_data = resp.get_json()

    assert resp.status_code == 400
    assert resp_data['message'] == 'User with this username or email already exists'

def test_successful_sign_up(client, app):
    req_data = {
        'username': 'John Doe',
        'email': 'johndoe@example.com',
        'password': 'Qwerty1234'
    }
    resp = client.post('/auth/sign-up/', data=req_data)
    resp_data = resp.get_json()

    assert resp.status_code == 200
    assert resp_data['username'] == req_data['username']
    assert check_password_hash(resp_data['password_hash'], req_data['password'])

    with app.app_context():
        assert UserModel.query.count() == 1
        assert UserModel.query.filter_by(email=req_data['email']).first().username == resp_data['username']

def test_sign_in_wrong_credentials(client):
    resp = client.post('/auth/sign-in/', data={
        'username': 'Chris',
        'password': 'iLoveBananas25'
    })

    resp_data = resp.get_json()

    assert resp.status_code == 400
    assert resp_data['message'] == 'Invalid credentials'

def test_successful_sign_in(client, app):
    with app.test_request_context():
        password = 'Qwerty1234'
        user = UserFactory(password_hash=password)
        req_data = {
            'username': user.username,
            'password': password
        }
        resp = client.post('/auth/sign-in/', data=req_data)
        resp_data = resp.get_json()
        
        assert resp.status_code == 200
        assert resp_data['username'] == req_data['username']
        assert check_password_hash(resp_data['password_hash'], req_data['password'])
        
        assert current_user.is_authenticated
        assert current_user.username == user.username
        assert not login_remembered()

def test_sign_in_remember_me(client, app):
    with client:
        password = 'Qwerty1234'
        u = UserFactory(password_hash=password)

        req = client.post('/auth/sign-in/', data={
            'username': u.username,
            'password': password,
            'remember-me': True
        })

        assert req.status_code == 200
        # Make another request to update the cookies
        client.get('/api/books/')
        assert login_remembered()

def test_sign_out_without_singning_in(client):
    resp = client.post('/auth/sign-out/')
    resp_data = resp.get_json()

    assert resp.status_code == 401
    assert resp_data['message'] == 'You should sign in before signing out!'

def test_successful_sign_out(client, app):
    user = UserFactory()
    with app.test_request_context():
        login_user(user)
        resp = client.post('/auth/sign-out/')

        assert resp.status_code == 200
        assert not current_user.is_authenticated
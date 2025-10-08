import pytest
from flask_bcrypt import check_password_hash
from flask import session
from app.models import UserModel, db
from flask_login import current_user, login_remembered

def test_sign_up_invalid_formdata(client):
    req_data = {
        'username': 'Donald',
        'address': 'Liberty street, 3',
        'phone_number': '+9123123441'
    }
    resp = client.post('/auth/sign-up/', data=req_data)
    data = resp.get_json()
    
    assert resp.status_code == 400
    assert 'email' in data['message'].keys()
    

def test_sign_up_invalid_password(client, app):
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
    user1 = {
        'username': 'John Doe',
        'email': 'johndoe@example.com',
        'password': 'Qwerty1234'
    }
    user2 = {
        'username': 'Jane Doe',
        'email': 'johndoe@example.com',
        'password': '1234AA1234'
    }
    client.post('/auth/sign-up/', data=user1)
    
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
        assert UserModel.query.count() == 2 # Because we already have a default user
        assert UserModel.query.filter_by(email=req_data['email']).first().username == resp_data['username']

# Sign In testing

def test_sign_in_wrong_credentials(client):
    resp = client.post('/auth/sign-in/', data={
        'username': 'Chris',
        'password': 'iLoveBananas25'
    })

    resp_data = resp.get_json()

    assert resp.status_code == 400
    assert resp_data['message'] == 'Invalid credentials'

def test_successful_sign_in(client, test_user_data, app):
    resp = client.get('/current-user')
    resp_data = resp.get_json()

    assert resp.status_code == 401
    assert resp_data['message'] == 'The user is not signed in'

    with app.app_context():
        user = db.session.get(UserModel, 1)
        req_data = {
            'username': user.username,
            'password': test_user_data['password']
        }
    resp = client.post('/auth/sign-in/', data=req_data)
    resp_data = resp.get_json()
    
    assert resp.status_code == 200
    assert resp_data['username'] == req_data['username']
    assert check_password_hash(resp_data['password_hash'], req_data['password'])
    
    # pushing context to make the session in the same scope as the response
    with client:
        resp = client.get('/current-user')
        resp_data = resp.get_json()

        assert resp.status_code == 200
        assert resp_data['email'] == user.email
        assert current_user == user
        assert int(session['_user_id']) == user.id
        assert not login_remembered()

@pytest.mark.filterwarnings('ignore') # Because flask-login uses deprected datetime method
def test_sign_in_remember_me(client, test_user_data, app):
    with app.app_context():
        user = db.session.get(UserModel, 1)
        req_data = {
            'username': user.username,
            'password': test_user_data['password'],
            'remember-me': True
        }

    resp = client.post('/auth/sign-in/', data=req_data)
    
    assert resp.status_code == 200
    
    with client:
        client.get('/current-user')
        assert current_user == user
        assert login_remembered()

def test_sign_out_without_singning_in(client):
    resp = client.post('/auth/sign-out/')
    resp_data = resp.get_json()

    assert resp.status_code == 401
    assert resp_data['message'] == 'You should sign in before signing out!'

def test_successful_sign_out(client, test_user_data, app):
    with app.app_context():
        user = db.session.get(UserModel, 1)
        req_data = {
            'username': user.username,
            'password': test_user_data['password']
        }
    client.post('/auth/sign-in/', data=req_data)
    
    with client:
        resp = client.post('/auth/sign-out/')

        assert resp.status_code == 200
        assert not '_user_id' in session
        assert not current_user.is_authenticated
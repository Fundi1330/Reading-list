from flask import Blueprint
from flask_restful import Api
from .regular_auth import SignUp, SignIn, SignOut
from flask_login import LoginManager

login_manager = LoginManager()

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
auth_api = Api(auth_bp)
auth_api.add_resource(SignUp, '/sign-up/')
auth_api.add_resource(SignIn, '/sign-in/')
auth_api.add_resource(SignOut, '/sign-out/')
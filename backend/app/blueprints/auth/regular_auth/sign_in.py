from flask_restful import Resource, reqparse, fields, marshal_with
from app.models import UserModel
from flask import abort, request
from flask_login import login_user
from .fields import user_fields

sign_in_args = reqparse.RequestParser()
sign_in_args.add_argument('username', type=str, required=True, location='form',
                       help='Username cannot be blank!')
sign_in_args.add_argument('remember-me', type=str, required=False, location='form',
                       help='Should user be remembered>')
sign_in_args.add_argument('password', type=str, required=True, location='form',
                       help='Password cannot be blank!') # The password has to be unhashed

class SignIn(Resource):
    @marshal_with(user_fields)
    def post(self):
        args = sign_in_args.parse_args()
        user: UserModel = UserModel.query.filter_by(username=args['username']).first()
        if user is None or not user.check_password(args['password']):
            return abort(400, 'Invalid credentials')

        remember_me = args.get('remember-me', False)

        login_user(user, remember=remember_me)
        
        return user
        
    
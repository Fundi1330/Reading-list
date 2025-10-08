from flask_restful import Resource, reqparse, marshal_with
from app.models import UserModel, db
from flask import abort
from .fields import user_fields

sign_up_args = reqparse.RequestParser()
sign_up_args.add_argument('username', type=str, required=True, location='form',
                       help='Username cannot be blank!')
sign_up_args.add_argument('email', type=str, required=True, location='form',
                       help='Email cannot be blank!')
sign_up_args.add_argument('password', type=str, required=True, location='form',
                       help='Password cannot be blank!') # The password has to be unhashed


class SignUp(Resource):
    @marshal_with(user_fields)
    def post(self):
        # registers a user and hashes his password
        args = sign_up_args.parse_args()
        user = UserModel.query.filter(UserModel.username==args['username'] or UserModel.email==args['email']).first()
        if user is not None:
            return abort(400, 'User with this username or email already exists')
        user = UserModel(username=args['username'], email=args['email'])
        is_password_valid = UserModel.validate_password(args['password'])
        if not is_password_valid[0]:
            return abort(400, is_password_valid[1])
        user.hash_and_set_password(args['password'])
        db.session.add(user)
        db.session.commit()
        
        return user
        
    
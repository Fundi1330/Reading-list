from flask_restful import Resource
from flask_login import logout_user, current_user
from flask import abort

class SignOut(Resource):
    def post(self):
        if not current_user.is_authenticated:
            return abort(401, 'You should sign in before signing out!')
        logout_user()
        
        return 200
        
    
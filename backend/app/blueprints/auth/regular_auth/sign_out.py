from flask_restful import Resource
from flask_login import logout_user
from flask import abort, session

class SignOut(Resource):
    def post(self):
        if not '_user_id' in session:
            return abort(401, 'You should sign in before signing out!')
        logout_user()
        
        return 200
        
    
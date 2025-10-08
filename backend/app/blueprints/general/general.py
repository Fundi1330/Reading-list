from flask import jsonify, Blueprint
from flask_wtf.csrf import generate_csrf
from flask_login import current_user
from flask_restful import marshal
from app.blueprints.auth.regular_auth.fields import user_fields

general_bp = Blueprint('general', __name__, url_prefix='/')

@general_bp.route('/csrf')
def csrf():
    response = jsonify(status='success')
    response.headers.set('X-CSRF-Token', generate_csrf())
    response.headers.add('Access-Control-Expose-Headers', 'X-CSRF-Token')
    return response

@general_bp.route('/current-user')
def get_current_user():
    if not current_user or current_user.is_anonymous:
        
        return jsonify({'message': 'The user is not signed in'}), 401

    return marshal(current_user, user_fields)
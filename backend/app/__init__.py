from flask import Flask
from flask_migrate import Migrate
from .models import db, CategoryModel, UserModel
from flask_cors import CORS
from flask_wtf import CSRFProtect
from dotenv import load_dotenv
import os
from .blueprints import auth_bp, api_bp, general_bp 
from .blueprints.auth import login_manager
from .flask_config import DevelmentConfig, ProductionConfig, TestingConfig

load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '../frontend', '.env'))) # the .env is located in frontend dir

migrate = Migrate()
csrf = CSRFProtect()
cors = CORS()

def create_app():
    app = Flask(__file__)

    match (os.environ.get('FLASK_ENV')):
        case 'DEVELOPMENT':
            app.config.from_object(DevelmentConfig())
        case 'PRODUCTION':
            app.config.from_object(ProductionConfig())
        case 'TESTING':
            app.config.from_object(TestingConfig())
        case _:
            raise ValueError('Wrong FLASK_ENV value!')
    if os.environ.get('FLASK_ENV') == 'TESTING':
        cors.init_app(app)
    else:
        cors.init_app(app,
                    resources={
                        r'/api/*': {
                            'origins': app.config.get('CORS_URL'),
                            'methods': ['GET', 'POST', 'OPTIONS', 'PATCH'],
                            'allow_headers': ['Content-Type', 'Authorization', 'X-CSRFToken']
                        },
                        r'/auth/*': {
                            'origins': app.config.get('CORS_URL'),
                            'methods': ['GET', 'POST', 'OPTIONS', 'PATCH'],
                            'allow_headers': ['Content-Type', 'Authorization', 'X-CSRFToken']
                        },
                        r'/csrf': {'origins': app.config.get('CORS_URL')},
                        r'/current-user': {'origins': app.config.get('CORS_URL')}
                    }, 
                    supports_credentials=True) 
    
    migrate.init_app(app, db)
    csrf.init_app(app)
    login_manager.init_app(app)
    db.init_app(app)

    app.app_context().push()
    
    with app.app_context():
        
        db.create_all()
        
        if not CategoryModel.query.filter_by(name='plans').one_or_none():
            # create three categories if they do not exist
            plans = CategoryModel(name='plans')
            in_process = CategoryModel(name='in-process')
            finished = CategoryModel(name='finished')
            db.session.add_all([plans, in_process, finished])
            db.session.commit()

    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(general_bp)

    return app

@login_manager.user_loader
def load_user(user_id):
    return UserModel.query.filter_by(id=int(user_id)).first()
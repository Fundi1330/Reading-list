from flask import Flask
from flask_migrate import Migrate
from .models import db, CategoryModel
from flask_cors import CORS
from flask_wtf import CSRFProtect
from dotenv import load_dotenv
from .blueprints import api, api_bp
import json

load_dotenv()

app = Flask(__file__)

app.config.from_file('../frontend/src/config.json', load=json.load)
app.config.from_pyfile('app/flask_config.py')

cors = CORS(app, resources={r'/api/*':{'origins': app.config.get('CORS_URL')}}) 
csrf = CSRFProtect(app)

app.app_context().push()

db.init_app(app)

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
csrf.exempt(api_bp)

migrate = Migrate(app, db)


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_bcrypt import Bcrypt
from re import search
from typing import Union, Optional
from flask_login import UserMixin

bcrypt = Bcrypt()
db = SQLAlchemy()

class BaseModel(db.Model):
    __abstract__ = True
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class UserModel(BaseModel, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(60), unique=True)
    username = db.Column(db.String(32), unique=True)
    password_hash = db.Column(db.String(256), nullable=False)
    books = db.relationship('BookModel', back_populates='user')

    @staticmethod
    def validate_password(password: str) -> Union[bool, Optional[str]]:
        if len(password) < 8:
            return False, 'Your password is too short! It should contain at least 8 symbols'
        
        if search(r'\d.*\d', password) is None:
            return False, 'Your password should contain at least 2 numbers'
        
        if search(r'[A-Z]+', password) is None:
            return False, 'Your password should have at least one capital letter!'

        return True, None

    def hash_and_set_password(self, password: str) -> None:
        self.password_hash = bcrypt.generate_password_hash(password=password, rounds=12).decode('utf-8')

    def check_password(self, password: str) -> bool:      
        return bcrypt.check_password_hash(self.password_hash.encode('utf-8'), password)
    
class BookModel(BaseModel):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    
    user = db.relationship('UserModel', back_populates='books')
    user_id = db.Column(db.ForeignKey('users.id'), nullable=False)
    category = db.relationship('CategoryModel', back_populates='books')
    category_id = db.Column(db.ForeignKey('categories.id'), nullable=False)
    position = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Book {self.name}>'

class CategoryModel(BaseModel):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60), nullable=False, unique=True)
    books = db.relationship('BookModel', back_populates='category')

    def __repr__(self):
        return f'<Category {self.name}>'
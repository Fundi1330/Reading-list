from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class BaseModel(db.Model):
    __abstract__ = True
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class BookModel(BaseModel):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    category_id = db.Column(db.ForeignKey('categories.id'), nullable=False)
    category = db.relationship('CategoryModel', back_populates='books')
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
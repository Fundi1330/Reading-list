from flask_restful import fields
from ....api.books.fields import book_fields

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'password_hash': fields.String,
    'books': fields.List(fields.Nested(book_fields))
}
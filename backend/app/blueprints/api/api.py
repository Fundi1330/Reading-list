from flask import Blueprint
from flask_restful import Api
from .books import Books, Book, BooksByCategories, ReorderBooks
from .categories import Categories, CategoryIds

# a blueprint for interacting with database

api_bp = Blueprint('api', __name__, url_prefix='/api')
api = Api(api_bp)
api.add_resource(Books, '/books/')
api.add_resource(BooksByCategories, '/books-by-categories/')
api.add_resource(Book, '/books/<int:id>/')
api.add_resource(ReorderBooks, '/books/reorder/')

api.add_resource(CategoryIds, '/category-ids/')
api.add_resource(Categories, '/categories/')
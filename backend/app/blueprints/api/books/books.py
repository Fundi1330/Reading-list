from flask_restful import Resource, reqparse, marshal_with, abort
from app.models import BookModel, db
from flask_login import login_required
from .fields.book_fields import book_fields, book_by_categories_fields
from flask_login import current_user

book_args = reqparse.RequestParser()
book_args.add_argument('name', type=str, required=True, 
                       help='Book name cannot be blank!')
book_args.add_argument('category_id', type=int, required=True, 
                       help='Book category cannot be blank!')
book_args.add_argument('position', type=int, required=True, 
                       help='Book position cannot be blank!')

reorder_args = reqparse.RequestParser()
reorder_args.add_argument('order', type=dict, required=True,
                          help='New book order cannot be blank!')

class BooksByCategories(Resource):
    @marshal_with(book_by_categories_fields)
    def get(self):
        plans = BookModel.query.filter_by(category_id=1, user_id=current_user.id).order_by(BookModel.position).all()
        in_process = BookModel.query.filter_by(category_id=2, user_id=current_user.id).order_by(BookModel.position).all()
        finished = BookModel.query.filter_by(category_id=3, user_id=current_user.id).order_by(BookModel.position).all()

        return {
            'plans': plans,
            'in-process': in_process,
            'finished': finished,
        }

class ReorderBooks(Resource):
    @marshal_with(book_fields)
    @login_required
    def patch(self):
        args = reorder_args.parse_args()
        for b_id, b_pos in args['order'].items():
            book = BookModel.query.filter_by(id=int(b_id), user_id=current_user.id).first()
            if not book:
                return abort(400, 'Invalid book id!')
            book.position = b_pos
        db.session.commit()
        return book

class Books(Resource):
    @marshal_with(book_fields)
    @login_required
    def get(self):
        books = BookModel.query.filter_by(user_id=current_user.id).order_by(BookModel.position).all()
        return books
    
    @marshal_with(book_fields)
    @login_required
    def post(self):
        args = book_args.parse_args()
        
        if BookModel.query.filter_by(name=args['name'], user_id=current_user.id).first() is not None:
            return abort(400, message='Book with this name is already in the list')
        book = BookModel(name=args['name'], category_id=args['category_id'], position=args['position'], user_id=current_user.id)
        db.session.add(book)
        db.session.commit()
        return book, 201
    
class Book(Resource):
    @marshal_with(book_fields)
    @login_required
    def get(self, id):
        book = BookModel.query.filter_by(id=id, user_id=current_user.id).first()
        if not book:
            return abort(404, 'Book not found')
        return book
    
    @marshal_with(book_fields)
    @login_required
    def patch(self, id):
        args = book_args.parse_args()
        book = BookModel.query.filter_by(id=id, user_id=current_user.id).first()
        if not book:
            return abort(404, 'Book not found')
        book.name = args['name']
        book.category_id = args['category_id']
        book.position = args['position']

        db.session.commit()
        return book
    
    @marshal_with(book_fields)
    @login_required
    def delete(self, id):
        book = BookModel.query.filter_by(id=id, user_id=current_user.id).first()
        if not book:
            return abort(404, 'Book not found')
        db.session.delete(book)
        db.session.commit()
        books = BookModel.query.filter_by(user_id=current_user.id).order_by(BookModel.position).all()
        return books
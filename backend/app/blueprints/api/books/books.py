from flask_restful import Resource, reqparse, fields, marshal_with, abort
from app.models import BookModel, db

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

book_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'category_id': fields.Integer,
    'category': fields.String(attribute=lambda x: x.category.name if x.category else None),
    'position': fields.Integer
}

book_by_categories_fields = {
    'plans': fields.List(fields.Nested(book_fields)),
    'in-process': fields.List(fields.Nested(book_fields)),
    'finished': fields.List(fields.Nested(book_fields))
}

class BooksByCategories(Resource):
    @marshal_with(book_by_categories_fields)
    def get(self):
        plans = BookModel.query.filter_by(category_id=1).order_by(BookModel.position).all()
        in_process = BookModel.query.filter_by(category_id=2).order_by(BookModel.position).all()
        finished = BookModel.query.filter_by(category_id=3).order_by(BookModel.position).all()

        return {
            'plans': plans,
            'in-process': in_process,
            'finished': finished,
        }

class ReorderBooks(Resource):
    @marshal_with(book_fields)
    def patch(self):
        args = reorder_args.parse_args()
        for b_id, b_pos in args['order'].items():
            book = BookModel.query.get(int(b_id))
            if not book:
                return abort(400, message='Invalid book id!')
            book.position = b_pos
        db.session.commit()
        return book

class Books(Resource):
    @marshal_with(book_fields)
    def get(self):
        books = BookModel.query.order_by(BookModel.position).all()
        return books
    
    @marshal_with(book_fields)
    def post(self):
        args = book_args.parse_args()
        if BookModel.query.filter_by(name=args['name']).first() is not None:
            return abort(400, message='Book with this name is already in the list')
        book = BookModel(name=args['name'], category_id=args['category_id'], position=args['position'])
        db.session.add(book)
        db.session.commit()
        return book, 201
    
class Book(Resource):
    @marshal_with(book_fields)
    def get(self, id):
        book = BookModel.query.filter_by(id=id).first()
        if not book:
            abort(404, message='Book not found')
        return book
    
    @marshal_with(book_fields)
    def patch(self, id):
        args = book_args.parse_args()
        book = BookModel.query.filter_by(id=id).first()
        if not book:
            abort(404, message='Book not found')
        book.name = args['name']
        book.category_id = args['category_id']
        book.position = args['position']

        db.session.commit()
        return book
    
    @marshal_with(book_fields)
    def delete(self, id):
        book = BookModel.query.filter_by(id=id).first()
        if not book:
            abort(404, message='Book not found')
        db.session.delete(book)
        db.session.commit()
        books = BookModel.query.order_by(BookModel.position).all()
        return books
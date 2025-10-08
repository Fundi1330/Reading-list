from flask_restful import fields

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
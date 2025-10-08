from flask_restful import fields

category_fields = {
    'id': fields.Integer,
    'name': fields.String
}

category_ids_fields = {
    'plans': fields.Integer,
    'in-process': fields.Integer,
    'finished': fields.Integer
}
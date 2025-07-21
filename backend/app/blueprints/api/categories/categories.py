from flask_restful import Resource, reqparse, fields, marshal_with, abort
from app.models import db, CategoryModel

category_args = reqparse.RequestParser()
category_args.add_argument('name', type=str, required=True, 
                       help='Category name cannot be blank!')

category_fields = {
    'id': fields.Integer,
    'name': fields.String
}

category_ids_fields = {
    'plans': fields.Integer,
    'in-process': fields.Integer,
    'finished': fields.Integer
}

class CategoryIds(Resource):
    @marshal_with(category_ids_fields)
    def get(self):
        plans = CategoryModel.query.filter_by(name='plans').first()
        in_process = CategoryModel.query.filter_by(name='in-process').first()
        finished = CategoryModel.query.filter_by(name='finished').first()
        if plans is None or in_process is None or finished is None:
            abort(404, message='Category not found')
        return {
            'plans': plans.id,
            'in-process': in_process.id,
            'finished': finished.id,
        }


class Categories(Resource):
    @marshal_with(category_fields)
    def get(self):
        categories = CategoryModel.query.all()
        return categories

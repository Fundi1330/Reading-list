from flask_restful import Resource, reqparse, marshal_with, abort
from app.models import db, CategoryModel
from flask_login import login_required
from .fields import category_fields, category_ids_fields
from flask_login import current_user
category_args = reqparse.RequestParser()
category_args.add_argument('name', type=str, required=True, 
                       help='Category name cannot be blank!')

class CategoryIds(Resource):
    @marshal_with(category_ids_fields)
    def get(self):
        plans = CategoryModel.query.filter_by(name='plans').first()
        in_process = CategoryModel.query.filter_by(name='in-process').first()
        finished = CategoryModel.query.filter_by(name='finished').first()
        if plans is None or in_process is None or finished is None:
           return abort(404, 'Category not found')
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

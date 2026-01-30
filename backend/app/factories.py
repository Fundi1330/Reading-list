import factory
from .models import UserModel, BookModel, CategoryModel, db
import datetime

class BaseFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        abstract = True
        sqlalchemy_session = db.session
        sqlalchemy_session_persistence = 'commit'
    
    created_at = factory.declarations.LazyFunction(datetime.datetime.now)
    updated_at = factory.declarations.LazyFunction(datetime.datetime.now)

class UserFactory(BaseFactory):
    class Meta:
        model = UserModel
    
    email = factory.Sequence(lambda n: f'user{n}@gmail.com')
    username = factory.Sequence(lambda n: f'user{n}')
    password_hash ='Test1234'

    @factory.post_generation
    def set_password(ins, *args, **kwargs):
        ins.hash_and_set_password(ins.password_hash)

class CategoryFactory(BaseFactory):
    class Meta:
        model = CategoryModel
    
    name = factory.Sequence(lambda n: f'category{n}')

class BookFactory(BaseFactory):
    class Meta:
        model = BookModel

    name = factory.Sequence(lambda n: f'book{n}')
    position = factory.Sequence(lambda n: n-1)
    user = factory.declarations.SubFactory(UserFactory)
    category = factory.declarations.SubFactory(CategoryFactory)
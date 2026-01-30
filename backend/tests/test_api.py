import pytest
from app.models import db, BookModel
from app.factories import UserFactory, BookFactory
from flask_login import login_user

def test_successful_create_book(client, category_ids, app):
    with app.test_request_context():
        u = UserFactory()
        login_user(u)
    
    book = {
        'name': 'Planning',
        'category_id': category_ids['plans'],
        'position': 0
    }
    
    resp = client.post('/api/books/', json=book)
    assert resp.status_code == 201
    assert resp.get_json()['category_id'] == book['category_id']

def test_ununique_book_title(client, category_ids, app):
    with app.test_request_context():
        u = UserFactory()
        login_user(u)
    
    BookFactory(name='Test', user=u, category_id=category_ids['in-process'])
    book = {
        'name': 'Test',
        'category_id': category_ids['in-process'],
        'position': 0
    }

    resp = client.post('/api/books/', json=book)
    resp_data = resp.get_json()
    assert resp.status_code == 400
    assert resp_data['message'] == 'Book with this name is already in the list'

def test_reorder(client, category_ids, app):
    with app.test_request_context():
        u = UserFactory()
        login_user(u)
    b1 = BookFactory(name='Test', user=u, category_id=category_ids['in-process'])
    b2 = BookFactory(name='Test', user=u, category_id=category_ids['in-process'])
    new_order = {
        'order': {
            b1.id: 1,
            b2.id: 0
        }
    }
    resp = client.patch('/api/books/reorder/', json=new_order)

    assert resp.status_code == 200
    with app.app_context():
        b1 = db.session.get(BookModel, b1.id)
        assert b1.position == new_order['order'][b1.id]
        b2 = db.session.get(BookModel, b2.id)
        assert b2.position == new_order['order'][b2.id]
import pytest
from app.models import db, BookModel

@pytest.mark.parametrize(
    'book',
    [
        {
            'name': 'Planning',
            'category_key': 'plans',
            'position': 0
        },
        {
            'name': 'Reading',
            'category_key': 'in-process',
            'position': 0
        },
        {
            'name': 'Read',
            'category_key': 'finished',
            'position': 0
        }
    ]
)
@pytest.mark.filterwarnings('ignore') # Because flask-login uses deprected datetime method
def test_successful_create_book(client, category_ids, book, auth, app):
    with app.test_request_context():
        auth.login()
    book['category_id'] = category_ids[book['category_key']]

    resp = client.post('/api/books/', json=book)
    assert resp.status_code == 201

@pytest.mark.filterwarnings('ignore') # Because flask-login uses deprected datetime method
def test_ununique_book_title(client, category_ids, auth, app):
    with app.test_request_context():
        auth.login()
    book1 = {
        'name': 'Test',
        'category_id': category_ids['plans'],
        'position': 0
    }
    book2 = {
        'name': 'Test',
        'category_id': category_ids['in-process'],
        'position': 0
    }

    client.post('/api/books/', json=book1)
    resp = client.post('/api/books/', json=book2)
    resp_data = resp.get_json()
    assert resp.status_code == 400
    assert resp_data['message'] == 'Book with this name is already in the list'

@pytest.mark.filterwarnings('ignore') # Because flask-login uses deprected datetime method
def test_reorder(client, category_ids, auth, app):
    with app.test_request_context():
        auth.login()
    book1 = {
        'name': 'Test1',
        'category_id': category_ids['plans'],
        'position': 0
    }
    book2 = {
        'name': 'Test2',
        'category_id': category_ids['plans'],
        'position': 1
    }

    resp1 = client.post('/api/books/', json=book1)
    book1['id'] = resp1.get_json()['id']
    resp2 = client.post('/api/books/', json=book2)
    book2['id'] = resp2.get_json()['id']
    new_order = {
        'order': {
            book1['id']: 1,
            book2['id']: 0
        }
    }
    resp = client.patch('/api/books/reorder/', json=new_order)

    assert resp.status_code == 200
    with app.app_context():
        b1 = db.session.get(BookModel, book1['id'])
        assert b1.position == new_order['order'][book1['id']]
        b2 = db.session.get(BookModel, book2['id'])
        assert b2.position == new_order['order'][book2['id']]
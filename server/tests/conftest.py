import pytest

from app import app as flask_app
from config import db as _db


@pytest.fixture
def app():
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    flask_app.config['TESTING'] = True

    with flask_app.app_context():
        _db.create_all()
        yield flask_app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def signup(client, username='alice', email='alice@example.com', password='password123'):
    return client.post('/signup', json={
        'username': username,
        'email': email,
        'password': password,
    })


@pytest.fixture
def auth_headers(client):
    """Sign up a fresh user and return (headers, user_id)."""
    def _make(username='alice', email='alice@example.com', password='password123'):
        res = signup(client, username, email, password)
        assert res.status_code == 201, res.get_json()
        data = res.get_json()
        return {'Authorization': f"Bearer {data['token']}"}, data['user']['id']
    return _make

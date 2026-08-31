from .conftest import signup


class TestSignup:
    def test_signup_returns_token_and_user(self, client):
        res = signup(client)
        assert res.status_code == 201
        data = res.get_json()
        assert 'token' in data
        assert data['user']['username'] == 'alice'
        assert '_password_hash' not in data['user']

    def test_signup_rejects_duplicate_username(self, client):
        signup(client)
        res = signup(client, email='someone-else@example.com')
        assert res.status_code == 400

    def test_signup_requires_username_and_password(self, client):
        res = client.post('/signup', json={'email': 'a@example.com'})
        assert res.status_code == 400

    def test_signup_rejects_short_username(self, client):
        res = signup(client, username='ab')
        assert res.status_code == 400

    def test_signup_rejects_invalid_email(self, client):
        res = signup(client, email='not-an-email')
        assert res.status_code == 400


class TestLogin:
    def test_login_with_correct_credentials(self, client):
        signup(client)
        res = client.post('/login', json={'username': 'alice', 'password': 'password123'})
        assert res.status_code == 200
        assert 'token' in res.get_json()

    def test_login_with_wrong_password(self, client):
        signup(client)
        res = client.post('/login', json={'username': 'alice', 'password': 'wrong'})
        assert res.status_code == 401

    def test_login_with_unknown_username(self, client):
        res = client.post('/login', json={'username': 'ghost', 'password': 'password123'})
        assert res.status_code == 401

    def test_passwords_are_never_stored_in_plaintext(self, client, app):
        from models import User
        signup(client)
        with app.app_context():
            user = User.query.filter_by(username='alice').first()
            assert user._password_hash != 'password123'
            assert user.authenticate('password123')
            assert not user.authenticate('wrong')


class TestCheckSession:
    def test_check_session_without_token(self, client):
        res = client.get('/check_session')
        assert res.status_code == 401

    def test_check_session_with_valid_token(self, client, auth_headers):
        headers, _ = auth_headers()
        res = client.get('/check_session', headers=headers)
        assert res.status_code == 200
        assert res.get_json()['username'] == 'alice'

    def test_check_session_with_garbage_token(self, client):
        res = client.get('/check_session', headers={'Authorization': 'Bearer garbage'})
        assert res.status_code == 422

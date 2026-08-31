VALID_TRIP = {
    'title': 'Weekend in Lisbon',
    'destination': 'Portugal',
    'start_date': '2027-01-10',
    'end_date': '2027-01-13',
}


def create_trip(client, headers, **overrides):
    payload = {**VALID_TRIP, **overrides}
    return client.post('/trips', json=payload, headers=headers)


class TestCreateTrip:
    def test_requires_authentication(self, client):
        res = client.post('/trips', json=VALID_TRIP)
        assert res.status_code == 401

    def test_creates_trip_owned_by_caller(self, client, auth_headers):
        headers, user_id = auth_headers()
        res = create_trip(client, headers)
        assert res.status_code == 201
        data = res.get_json()
        assert data['user_id'] == user_id
        assert data['title'] == VALID_TRIP['title']

    def test_rejects_missing_fields(self, client, auth_headers):
        headers, _ = auth_headers()
        res = client.post('/trips', json={'title': 'No destination'}, headers=headers)
        assert res.status_code == 400

    def test_rejects_end_date_before_start_date(self, client, auth_headers):
        headers, _ = auth_headers()
        res = create_trip(client, headers, start_date='2027-01-13', end_date='2027-01-10')
        assert res.status_code == 400


class TestTripAuthorization:
    def test_owner_can_update_their_trip(self, client, auth_headers):
        headers, _ = auth_headers()
        trip_id = create_trip(client, headers).get_json()['id']

        res = client.patch(f'/trips/{trip_id}', json={'title': 'Updated title'}, headers=headers)
        assert res.status_code == 200
        assert res.get_json()['title'] == 'Updated title'

    def test_owner_can_delete_their_trip(self, client, auth_headers):
        headers, _ = auth_headers()
        trip_id = create_trip(client, headers).get_json()['id']

        res = client.delete(f'/trips/{trip_id}', headers=headers)
        assert res.status_code == 204
        assert client.get(f'/trips/{trip_id}').status_code == 404

    def test_other_user_cannot_update_trip(self, client, auth_headers):
        owner_headers, _ = auth_headers('alice', 'alice@example.com')
        trip_id = create_trip(client, owner_headers).get_json()['id']

        other_headers, _ = auth_headers('bob', 'bob@example.com')
        res = client.patch(f'/trips/{trip_id}', json={'title': 'Hijacked'}, headers=other_headers)
        assert res.status_code == 403

        # Confirm nothing changed.
        original = client.get(f'/trips/{trip_id}').get_json()
        assert original['title'] == VALID_TRIP['title']

    def test_other_user_cannot_delete_trip(self, client, auth_headers):
        owner_headers, _ = auth_headers('alice', 'alice@example.com')
        trip_id = create_trip(client, owner_headers).get_json()['id']

        other_headers, _ = auth_headers('bob', 'bob@example.com')
        res = client.delete(f'/trips/{trip_id}', headers=other_headers)
        assert res.status_code == 403
        assert client.get(f'/trips/{trip_id}').status_code == 200

    def test_patch_cannot_mass_assign_id_or_user_id(self, client, auth_headers):
        headers, user_id = auth_headers()
        trip_id = create_trip(client, headers).get_json()['id']

        res = client.patch(
            f'/trips/{trip_id}',
            json={'id': 999, 'user_id': 999, 'title': 'Still mine'},
            headers=headers,
        )
        assert res.status_code == 200
        data = res.get_json()
        assert data['id'] == trip_id
        assert data['user_id'] == user_id


class TestPhotoOwnership:
    def test_owner_can_add_photo(self, client, auth_headers):
        headers, _ = auth_headers()
        trip_id = create_trip(client, headers).get_json()['id']

        res = client.post('/photos', json={'url': 'http://example.com/a.jpg', 'trip_id': trip_id}, headers=headers)
        assert res.status_code == 201

    def test_other_user_cannot_add_photo_to_trip_they_do_not_own(self, client, auth_headers):
        owner_headers, _ = auth_headers('alice', 'alice@example.com')
        trip_id = create_trip(client, owner_headers).get_json()['id']

        other_headers, _ = auth_headers('bob', 'bob@example.com')
        res = client.post('/photos', json={'url': 'http://example.com/a.jpg', 'trip_id': trip_id}, headers=other_headers)
        assert res.status_code == 403

    def test_add_photo_requires_authentication(self, client, auth_headers):
        headers, _ = auth_headers()
        trip_id = create_trip(client, headers).get_json()['id']

        res = client.post('/photos', json={'url': 'http://example.com/a.jpg', 'trip_id': trip_id})
        assert res.status_code == 401


class TestTripFollowers:
    def test_follow_uses_jwt_identity_not_request_body(self, client, auth_headers):
        owner_headers, _ = auth_headers('alice', 'alice@example.com')
        trip_id = create_trip(client, owner_headers).get_json()['id']

        bob_headers, bob_id = auth_headers('bob', 'bob@example.com')
        res = client.post(
            '/trip-followers',
            json={'user_id': 999, 'trip_id': trip_id, 'reason_for_following': 'nice'},
            headers=bob_headers,
        )
        assert res.status_code == 201
        assert res.get_json()['user_id'] == bob_id

    def test_cannot_follow_same_trip_twice(self, client, auth_headers):
        owner_headers, _ = auth_headers('alice', 'alice@example.com')
        trip_id = create_trip(client, owner_headers).get_json()['id']

        bob_headers, _ = auth_headers('bob', 'bob@example.com')
        client.post('/trip-followers', json={'trip_id': trip_id}, headers=bob_headers)
        res = client.post('/trip-followers', json={'trip_id': trip_id}, headers=bob_headers)
        assert res.status_code == 400

    def test_cannot_unfollow_as_a_different_user(self, client, auth_headers):
        owner_headers, _ = auth_headers('alice', 'alice@example.com')
        trip_id = create_trip(client, owner_headers).get_json()['id']

        bob_headers, bob_id = auth_headers('bob', 'bob@example.com')
        client.post('/trip-followers', json={'trip_id': trip_id}, headers=bob_headers)

        carol_headers, _ = auth_headers('carol', 'carol@example.com')
        res = client.delete(f'/trip-followers/{bob_id}/{trip_id}', headers=carol_headers)
        assert res.status_code == 403


class TestHealth:
    def test_health_check(self, client):
        res = client.get('/health')
        assert res.status_code == 200
        assert res.get_json() == {'status': 'ok'}

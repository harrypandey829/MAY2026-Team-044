from uuid import uuid4

from tests.conftest import client

def test_create_event():

    response = client.post(
        "/events",
        json={
            "team_id": None,
            "created_by": str(uuid4()),
            "title": "Morning Practice",
            "event_type": "Practice",
            "date": "2026-08-05",
            "start_time": "07:00:00",
            "end_time": "09:00:00",
            "venue": "Main Ground",
            "opponent": None,
            "description": "Practice Session",
            "max_participants": 25,
            "registration_deadline": "2026-08-04"
        }
    )

    assert response.status_code == 201

def test_get_all_events():
    response = client.get("/events")

    assert response.status_code == 200

    assert isinstance(
        response.json(),
        list
    )   

def test_get_unknown_event():

    response = client.get(
        f"/events/{uuid4()}"
    )

    assert response.status_code == 404


def test_update_unknown_event():

    response = client.put(

        f"/events/{uuid4()}",

        json={

            "title": "Updated",

            "event_type": "Practice",

            "date": "2026-08-05",

            "start_time": "08:00:00",

            "venue": "Ground",

            "opponent": None,

            "description": None
        }
    )

    assert response.status_code == 404


def test_cancel_unknown_event():

    response = client.patch(
        f"/events/{uuid4()}/cancel"
    )

    assert response.status_code == 404



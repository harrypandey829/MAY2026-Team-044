from uuid import uuid4
from tests.conftest import client


def test_event_lifecycle():
    # 1. Create event
    create_res = client.post(
        "/events",
        json={
            "team_id": None,
            "created_by": str(uuid4()),
            "title": "Evening Practice",
            "event_type": "Practice",
            "date": "2026-08-20",
            "start_time": "18:00:00",
            "end_time": "20:00:00",
            "venue": "West Court",
            "opponent": None,
            "description": "Team conditioning and tactics",
            "max_participants": 15,
            "registration_deadline": "2026-08-19",
            "sport": "Tennis"
        }
    )
    assert create_res.status_code == 201
    event_data = create_res.json()
    event_id = event_data["id"]
    assert event_data["title"] == "Evening Practice"

    # 2. Get event by ID
    get_res = client.get(f"/events/{event_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == event_id

    # 3. Update event
    update_res = client.put(
        f"/events/{event_id}",
        json={
            "title": "Updated Evening Practice",
            "event_type": "Practice",
            "date": "2026-08-20",
            "start_time": "18:30:00",
            "venue": "Indoor Stadium",
            "opponent": None,
            "description": "Updated description",
            "max_participants": 20
        }
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Evening Practice"

    # 4. Cancel event
    cancel_res = client.patch(f"/events/{event_id}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["event_status"] == "Cancelled"


def test_create_match_event():
    response = client.post(
        "/events",
        json={
            "team_id": None,
            "created_by": str(uuid4()),
            "title": "Championship Match",
            "event_type": "Match",
            "date": "2026-08-25",
            "start_time": "15:00:00",
            "end_time": "17:00:00",
            "venue": "Main Arena",
            "opponent": "Rival FC",
            "description": "Final match of the season",
            "max_participants": 22,
            "registration_deadline": "2026-08-24",
            "sport": "Football"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Championship Match"
    assert data["event_type"] == "Match"
    assert data["opponent"] == "Rival FC"


def test_get_all_events():
    response = client.get("/events")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_event_invalid_payload():
    response = client.post(
        "/events",
        json={
            "title": "Invalid Event"
            # missing date, start_time, end_time, venue, event_type
        }
    )
    assert response.status_code == 422


def test_get_unknown_event():
    response = client.get(f"/events/{uuid4()}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Event not found"


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
    assert response.json()["detail"] == "Event not found"


def test_cancel_unknown_event():
    response = client.patch(f"/events/{uuid4()}/cancel")
    assert response.status_code == 404
    assert response.json()["detail"] == "Event not found"


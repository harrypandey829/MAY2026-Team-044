from uuid import uuid4
from tests.conftest import client


def test_register_event_flow():
    # 1. Create a user
    signup = client.post(
        "/auth/signup",
        json={
            "first_name": "Event",
            "last_name": "Member",
            "email": f"event_reg_{uuid4()}@test.com",
            "phone": "9998887776",
            "password": "Password@123"
        }
    )
    assert signup.status_code == 201
    user_id = signup.json()["user"]["id"]

    # 2. Create an event
    event = client.post(
        "/events",
        json={
            "team_id": None,
            "created_by": str(uuid4()),
            "title": "Match Fixture",
            "event_type": "Match",
            "date": "2026-08-25",
            "start_time": "15:00:00",
            "end_time": "17:00:00",
            "venue": "East Field",
            "opponent": "Rival FC",
            "description": "Championship match",
            "max_participants": 20,
            "registration_deadline": "2026-08-24"
        }
    )
    assert event.status_code == 201
    event_id = event.json()["id"]

    # 3. Register user for event
    reg = client.post(
        "/event-registrations",
        json={
            "event_id": event_id,
            "member_id": user_id
        }
    )
    assert reg.status_code == 201
    assert reg.json()["event_id"] == event_id

    # 4. Attempt duplicate registration (should return 400)
    dup = client.post(
        "/event-registrations",
        json={
            "event_id": event_id,
            "member_id": user_id
        }
    )
    assert dup.status_code == 400
    assert dup.json()["detail"] == "Already registered"

    # 5. Fetch registrations for event
    event_regs = client.get(f"/event-registrations/{event_id}")
    assert event_regs.status_code == 200
    assert len(event_regs.json()) >= 1

    # 6. Fetch registrations for member
    member_regs = client.get(f"/event-registrations/member/{user_id}")
    assert member_regs.status_code == 200
    assert len(member_regs.json()) >= 1

    # 7. Unregister member
    unreg = client.delete(f"/event-registrations/{event_id}/{user_id}")
    assert unreg.status_code == 200

    # 8. Unregister non-existent registration (should return 404)
    unreg_fail = client.delete(f"/event-registrations/{event_id}/{user_id}")
    assert unreg_fail.status_code == 404


def test_register_unknown_event():
    response = client.post(
        "/event-registrations",
        json={
            "event_id": str(uuid4()),
            "member_id": str(uuid4())
        }
    )
    assert response.status_code == 404


def test_register_unknown_member():
    # Create valid event
    event = client.post(
        "/events",
        json={
            "title": "Practice Session",
            "event_type": "Practice",
            "date": "2026-08-25",
            "start_time": "10:00:00",
            "end_time": "12:00:00",
            "venue": "Court 1",
            "max_participants": 10
        }
    )
    event_id = event.json()["id"]

    response = client.post(
        "/event-registrations",
        json={
            "event_id": event_id,
            "member_id": str(uuid4())
        }
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Member not found"


def test_register_invalid_payload():
    response = client.post(
        "/event-registrations",
        json={}
    )
    assert response.status_code == 422


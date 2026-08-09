from uuid import uuid4

from tests.conftest import client


def test_mark_without_registration():

    response = client.post(

        "/attendance",

        json={

            "event_id": str(uuid4()),

            "member_id": str(uuid4()),

            "attendance_status": "Present",

            "remarks": ""
        }
    )

    assert response.status_code == 400


def test_member_history():

    response = client.get(
        f"/attendance/member/{uuid4()}"
    )

    assert response.status_code == 200


def test_event_attendance():

    response = client.get(
        f"/attendance/event/{uuid4()}"
    )

    assert response.status_code == 200


def test_valid_mark_attendance():
    # Create user
    signup_res = client.post(
        "/auth/signup",
        json={
            "first_name": "Test",
            "last_name": "Member",
            "email": f"{uuid4()}@test.com",
            "phone": "1234567890",
            "password": "Password@123",
            "role": "Member"
        }
    )
    user_id = signup_res.json()["user"]["id"]

    # Create event
    event_res = client.post(
        "/events",
        json={
            "team_id": None,
            "created_by": str(uuid4()),
            "title": "Attendance Test Event",
            "event_type": "Practice",
            "date": "2026-08-10",
            "start_time": "10:00:00",
            "end_time": "12:00:00",
            "venue": "Field",
            "opponent": None,
            "description": "Test",
            "max_participants": 20,
            "registration_deadline": "2026-08-09"
        }
    )
    event_id = event_res.json()["id"]

    # Mark attendance first time
    res1 = client.post(
        "/attendance",
        json={
            "event_id": event_id,
            "member_id": user_id,
            "attendance_status": "Present",
            "remarks": "Good performance"
        }
    )
    print("res1 status:", res1.status_code, res1.text)
    assert res1.status_code == 201
    data = res1.json()
    assert data["member_id"] == user_id
    assert data["attendance_status"] == "Present"

    # Mark attendance second time (updates existing record)
    res2 = client.post(
        "/attendance",
        json={
            "event_id": event_id,
            "member_id": user_id,
            "attendance_status": "Late",
            "remarks": "Updated status to Late"
        }
    )
    assert res2.status_code == 201
    assert res2.json()["attendance_status"] == "Late"

    # Check member history
    res_hist = client.get(f"/attendance/member/{user_id}")
    assert res_hist.status_code == 200
    hist = res_hist.json()
    assert len(hist) == 1
    assert hist[0]["attendance_status"] == "Late"





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



from uuid import uuid4

from tests.conftest import client


def test_register_unknown_event():

    response = client.post(

        "/event-registrations",

        json={

            "event_id": str(uuid4()),

            "member_id": str(uuid4())
        }
    )

    assert response.status_code == 404

def test_get_registered_members():

    response = client.get(
        f"/event-registrations/{uuid4()}"
    )

    assert response.status_code == 200


from uuid import uuid4

from tests.conftest import client


def test_create_notification():

    response = client.post(
        "/notifications",
        json={
            "member_id": str(uuid4()),
            "title": "Reminder",
            "message": "Practice today"
        }
    )

    assert response.status_code in [201, 404]


def test_get_notifications():

    response = client.get("/notifications")

    assert response.status_code == 200


def test_unknown_notification():

    response = client.get(
        f"/notifications/{uuid4()}"
    )

    assert response.status_code == 404


def test_mark_unknown_notification():

    response = client.patch(
        f"/notifications/{uuid4()}/read"
    )

    assert response.status_code == 404


def test_delete_unknown_notification():

    response = client.delete(
        f"/notifications/{uuid4()}"
    )

    assert response.status_code == 404
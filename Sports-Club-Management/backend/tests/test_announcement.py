from uuid import uuid4

from tests.conftest import client


def test_create_announcement():

    response = client.post(
        "/announcements",
        json={
            "title": "Practice Cancelled",
            "message": "Due to rain.",
            "created_by": str(uuid4())
        }
    )

    assert response.status_code in [201, 404]


def test_get_all_announcements():

    response = client.get(
        "/announcements"
    )

    assert response.status_code == 200


def test_get_unknown_announcement():

    response = client.get(
        f"/announcements/{uuid4()}"
    )

    assert response.status_code == 404


def test_update_unknown_announcement():

    response = client.put(
        f"/announcements/{uuid4()}",
        json={
            "title": "Updated",
            "message": "Updated message"
        }
    )

    assert response.status_code == 404


def test_delete_unknown_announcement():

    response = client.delete(
        f"/announcements/{uuid4()}"
    )

    assert response.status_code == 404
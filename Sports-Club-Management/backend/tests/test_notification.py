from uuid import uuid4

from tests.conftest import client


def test_notification_lifecycle():
    user_id = str(uuid4())

    # 1. Create notification
    create_res = client.post(
        "/notifications",
        json={
            "member_id": user_id,
            "title": "Session Reminder",
            "message": "Practice starts in 1 hour on Pitch 2"
        }
    )
    assert create_res.status_code == 201
    notif_data = create_res.json()
    notif_id = notif_data["id"]
    assert notif_data["title"] == "Session Reminder"
    assert notif_data["is_read"] is False

    # 2. Get notification by ID
    get_res = client.get(f"/notifications/{notif_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == notif_id

    # 3. Mark notification as read
    read_res = client.patch(f"/notifications/{notif_id}/read")
    assert read_res.status_code == 200
    assert read_res.json()["is_read"] is True

    # 4. Delete notification
    del_res = client.delete(f"/notifications/{notif_id}")
    assert del_res.status_code == 200


def test_get_notifications():

    response = client.get("/notifications")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


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


def test_create_notification_invalid_payload():
    response = client.post(
        "/notifications",
        json={}
    )
    assert response.status_code == 422
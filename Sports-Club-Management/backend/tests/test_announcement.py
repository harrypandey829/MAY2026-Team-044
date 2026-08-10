from uuid import uuid4

from tests.conftest import client


def test_announcement_lifecycle():
    user_id = str(uuid4())

    # 1. Create announcement
    create_res = client.post(
        "/announcements",
        json={
            "title": "Practice Cancelled",
            "message": "Due to heavy rainfall.",
            "created_by": user_id
        }
    )
    assert create_res.status_code == 201
    ann_data = create_res.json()
    ann_id = ann_data["id"]
    assert ann_data["title"] == "Practice Cancelled"

    # 2. Get by ID
    get_res = client.get(f"/announcements/{ann_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == ann_id

    # 3. Update announcement
    update_res = client.put(
        f"/announcements/{ann_id}",
        json={
            "title": "Practice Rescheduled",
            "message": "Moved to indoor arena at 6:00 PM."
        }
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Practice Rescheduled"

    # 4. Delete announcement
    del_res = client.delete(f"/announcements/{ann_id}")
    assert del_res.status_code == 200


def test_get_all_announcements():

    response = client.get(
        "/announcements"
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


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


def test_create_announcement_invalid_payload():
    response = client.post(
        "/announcements",
        json={}
    )
    assert response.status_code == 422
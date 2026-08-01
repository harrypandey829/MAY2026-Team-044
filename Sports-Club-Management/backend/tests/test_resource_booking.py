from uuid import uuid4

from tests.conftest import client


def test_create_booking():

    response = client.post(
        "/resource-bookings",
        json={
            "resource_id": str(uuid4()),
            "member_id": str(uuid4()),
            "booking_date": "2026-08-15T09:00:00",
            "duration_hours": 2
        }
    )

    assert response.status_code in [201, 404]


def test_get_all_bookings():

    response = client.get("/resource-bookings")

    assert response.status_code == 200


def test_unknown_booking():

    response = client.get(
        f"/resource-bookings/{uuid4()}"
    )

    assert response.status_code == 404


def test_update_unknown_booking():

    response = client.put(

        f"/resource-bookings/{uuid4()}",

        json={

            "booking_date": "2026-08-15T10:00:00",

            "duration_hours": 3,

            "is_cancelled": False
        }
    )

    assert response.status_code == 404


def test_delete_unknown_booking():

    response = client.delete(
        f"/resource-bookings/{uuid4()}"
    )

    assert response.status_code == 404
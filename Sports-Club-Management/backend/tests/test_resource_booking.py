from uuid import uuid4

from tests.conftest import client


def test_booking_lifecycle():
    # 1. Create a facility resource first
    res = client.post(
        "/resources",
        json={
            "name": "Tennis Court A",
            "resource_type": "Court",
            "quantity": 1,
            "is_available": True
        }
    )
    resource_id = res.json()["id"]
    user_id = str(uuid4())

    # 2. Book resource
    create_booking = client.post(
        "/resource-bookings",
        json={
            "resource_id": resource_id,
            "member_id": user_id,
            "booking_date": "2026-08-25T14:00:00",
            "duration_hours": 2
        }
    )
    assert create_booking.status_code == 201
    booking_data = create_booking.json()
    booking_id = booking_data["id"]
    assert booking_data["resource_id"] == resource_id

    # 3. Get booking by ID
    get_booking = client.get(f"/resource-bookings/{booking_id}")
    assert get_booking.status_code == 200
    assert get_booking.json()["id"] == booking_id

    # 4. Update booking slot
    update_booking = client.put(
        f"/resource-bookings/{booking_id}",
        json={
            "booking_date": "2026-08-25T15:00:00",
            "duration_hours": 3,
            "is_cancelled": False
        }
    )
    assert update_booking.status_code == 200

    # 5. Delete booking
    del_booking = client.delete(f"/resource-bookings/{booking_id}")
    assert del_booking.status_code == 200


def test_get_all_bookings():

    response = client.get("/resource-bookings")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


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


def test_create_booking_invalid_payload():
    response = client.post(
        "/resource-bookings",
        json={}
    )
    assert response.status_code == 422
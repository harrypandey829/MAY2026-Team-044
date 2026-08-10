from uuid import uuid4

from tests.conftest import client


def test_resource_lifecycle():
    # 1. Create resource
    create_res = client.post(
        "/resources",
        json={
            "name": "Badminton Court 1",
            "resource_type": "Court",
            "quantity": 2,
            "is_available": True
        }
    )
    assert create_res.status_code == 201
    res_data = create_res.json()
    res_id = res_data["id"]
    assert res_data["name"] == "Badminton Court 1"

    # 2. Get by ID
    get_res = client.get(f"/resources/{res_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == res_id

    # 3. Update resource
    update_res = client.put(
        f"/resources/{res_id}",
        json={
            "name": "Indoor Badminton Court 1",
            "resource_type": "Court",
            "quantity": 4,
            "is_available": True
        }
    )
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "Indoor Badminton Court 1"

    # 4. Delete resource
    del_res = client.delete(f"/resources/{res_id}")
    assert del_res.status_code == 200


def test_get_resources():

    response = client.get("/resources")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_unknown_resource():

    response = client.get(
        f"/resources/{uuid4()}"
    )

    assert response.status_code == 404


def test_update_unknown_resource():

    response = client.put(

        f"/resources/{uuid4()}",

        json={

            "name": "Court",

            "resource_type": "Court",

            "quantity": 5,

            "is_available": True
        }
    )

    assert response.status_code == 404


def test_delete_unknown_resource():

    response = client.delete(
        f"/resources/{uuid4()}"
    )

    assert response.status_code == 404


def test_create_resource_invalid_payload():
    response = client.post(
        "/resources",
        json={}
    )
    assert response.status_code == 422
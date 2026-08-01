from uuid import uuid4

from tests.conftest import client


def test_create_resource():

    response = client.post(
        "/resources",
        json={
            "name": "Badminton Court",
            "resource_type": "Court",
            "quantity": 4
        }
    )

    assert response.status_code == 201


def test_get_resources():

    response = client.get("/resources")

    assert response.status_code == 200


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
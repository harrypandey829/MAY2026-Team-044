from uuid import uuid4

from tests.conftest import client


def test_create_performance_record():

    response = client.post(
        "/performance",
        json={
            "member_id": str(uuid4()),
            "event_id": str(uuid4()),
            "coach_id": str(uuid4()),
            "points": 25,
            "assists": 6,
            "rebounds": 10,
            "minutes_played": 40,
            "remarks": "Excellent match"
        }
    )

    assert response.status_code in [201, 404]


def test_get_all_performance():

    response = client.get("/performance")

    assert response.status_code == 200

    assert isinstance(response.json(), list)


def test_get_unknown_performance():

    response = client.get(
        f"/performance/{uuid4()}"
    )

    assert response.status_code == 404


def test_update_unknown_performance():

    response = client.put(
        f"/performance/{uuid4()}",
        json={
            "points": 30,
            "assists": 5,
            "rebounds": 8,
            "minutes_played": 35,
            "remarks": "Updated"
        }
    )

    assert response.status_code == 404


def test_delete_unknown_performance():

    response = client.delete(
        f"/performance/{uuid4()}"
    )

    assert response.status_code == 404
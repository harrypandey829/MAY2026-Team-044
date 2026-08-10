from uuid import uuid4

from tests.conftest import client


def test_performance_lifecycle():
    member_id = str(uuid4())
    event_id = str(uuid4())

    # 1. Create performance record
    create_res = client.post(
        "/performance",
        json={
            "member_id": member_id,
            "event_id": event_id,
            "goals": 2,
            "assists": 1,
            "yellow_cards": 0,
            "red_cards": 0,
            "minutes_played": 90,
            "rating": 8.5,
            "remarks": "Outstanding performance"
        }
    )
    assert create_res.status_code == 201
    perf_data = create_res.json()
    perf_id = perf_data["id"]
    assert perf_data["goals"] == 2
    assert perf_data["rating"] == 8.5

    # 2. Get by ID
    get_res = client.get(f"/performance/{perf_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == perf_id

    # 3. Get member performance history
    hist_res = client.get(f"/performance/member/{member_id}")
    assert hist_res.status_code == 200
    assert len(hist_res.json()) >= 1

    # 4. Update performance record
    update_res = client.put(
        f"/performance/{perf_id}",
        json={
            "goals": 3,
            "assists": 1,
            "rating": 9.2,
            "remarks": "Hat-trick!"
        }
    )
    assert update_res.status_code == 200
    assert update_res.json()["goals"] == 3

    # 5. Delete performance record
    del_res = client.delete(f"/performance/{perf_id}")
    assert del_res.status_code == 200


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
            "goals": 1,
            "assists": 0,
            "rating": 7.0
        }
    )

    assert response.status_code == 404


def test_delete_unknown_performance():

    response = client.delete(
        f"/performance/{uuid4()}"
    )

    assert response.status_code == 404


def test_create_performance_invalid_payload():
    response = client.post(
        "/performance",
        json={}
    )
    assert response.status_code == 422
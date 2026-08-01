from uuid import uuid4

from tests.conftest import client


def test_get_user_by_id():

    email = f"{uuid4()}@gmail.com"

    signup = client.post(
        "/auth/signup",
        json={
            "first_name": "Hari",
            "last_name": "Pandey",
            "email": email,
            "phone": "9999999999",
            "password": "Password@123"
        }
    )

    user_id = signup.json()["id"]

    response = client.get(
        f"/users/{user_id}"
    )

    assert response.status_code == 200

    body = response.json()

    assert body["email"] == email





def test_get_user_not_found():

    response = client.get(
        f"/users/{uuid4()}"
    )

    assert response.status_code == 404


def test_get_all_users():

    response = client.get("/users")

    assert response.status_code == 200

    assert isinstance(
        response.json(),
        list
    )





def test_update_profile():

    email = f"{uuid4()}@gmail.com"

    signup = client.post(
        "/auth/signup",
        json={
            "first_name": "Hari",
            "last_name": "Pandey",
            "email": email,
            "phone": "9999999999",
            "password": "Password@123"
        }
    )

    user_id = signup.json()["id"]

    response = client.put(
        f"/users/{user_id}",
        json={
            "first_name": "New",
            "last_name": "Name",
            "phone": "8888888888",
            "profile_picture_url": None
        }
    )

    assert response.status_code == 200

    body = response.json()

    assert body["first_name"] == "New"

    assert body["phone"] == "8888888888"




def test_update_unknown_user():

    response = client.put(
        f"/users/{uuid4()}",
        json={
            "first_name": "A",
            "last_name": "B",
            "phone": None,
            "profile_picture_url": None
        }
    )

    assert response.status_code == 404




def test_reset_password():

    email = f"{uuid4()}@gmail.com"

    client.post(
        "/auth/signup",
        json={
            "first_name": "Hari",
            "last_name": "Pandey",
            "email": email,
            "phone": "9999999999",
            "password": "Password@123"
        }
    )

    response = client.post(
        "/users/reset-password",
        json={
            "email": email,
            "old_password": "Password@123",
            "new_password": "NewPassword@123"
        }
    )

    assert response.status_code == 200





def test_wrong_old_password():

    email = f"{uuid4()}@gmail.com"

    client.post(
        "/auth/signup",
        json={
            "first_name": "Hari",
            "last_name": "Pandey",
            "email": email,
            "phone": "9999999999",
            "password": "Password@123"
        }
    )

    response = client.post(
        "/users/reset-password",
        json={
            "email": email,
            "old_password": "WrongPassword",
            "new_password": "NewPassword@123"
        }
    )

    assert response.status_code == 400
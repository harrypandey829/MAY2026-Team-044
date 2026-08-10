from tests.conftest import client


def test_login_success():

    payload = {
        "first_name": "Hari",
        "last_name": "Pandey",
        "email": "login@gmail.com",
        "phone": "9999999999",
        "password": "Password@123"
    }

    client.post("/auth/signup", json=payload)

    response = client.post(
        "/auth/login",
        json={
            "email": "login@gmail.com",
            "password": "Password@123"
        }
    )

    assert response.status_code == 200

    body = response.json()

    assert "access_token" in body
    assert body["user"]["email"] == "login@gmail.com"


def test_wrong_password():

    response = client.post(
        "/auth/login",
        json={
            "email": "login@gmail.com",
            "password": "WrongPassword"
        }
    )

    assert response.status_code == 401

def test_email_not_found():

    response = client.post(
        "/auth/login",
        json={
            "email": "xyz@gmail.com",
            "password": "Password@123"
        }
    )

    assert response.status_code == 401
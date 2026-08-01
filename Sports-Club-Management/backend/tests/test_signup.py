from tests.conftest import client





def test_signup_success():

    response = client.post(
        "/auth/signup",
        json={
            "first_name": "Hari",
            "last_name": "Pandey",
            "email": "signup_test_1@gmail.com",
            "phone": "9999999999",
            "password": "Password@123"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["message"] == "User created successfully"


def test_duplicate_email():

    payload = {
        "first_name": "Hari",
        "last_name": "Pandey",
        "email": "duplicate@gmail.com",
        "phone": "9999999999",
        "password": "Password@123"
    }

    client.post("/auth/signup", json=payload)

    response = client.post("/auth/signup", json=payload)

    assert response.status_code == 400


def test_invalid_email():

    response = client.post(
        "/auth/signup",
        json={
            "first_name": "Hari",
            "last_name": "Pandey",
            "email": "abc",
            "phone": "9999999999",
            "password": "Password@123"
        }
    )

    assert response.status_code == 422

def test_missing_first_name():

    response = client.post(
        "/auth/signup",
        json={
            "last_name": "Pandey",
            "email": "hari@gmail.com",
            "phone": "9999999999",
            "password": "Password@123"
        }
    )

    assert response.status_code == 422
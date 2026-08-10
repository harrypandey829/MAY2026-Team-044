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

    user_id = signup.json()["user"]["id"]

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

    user_id = signup.json()["user"]["id"]

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


def test_get_users_by_role():
    # Create member
    client.post(
        "/auth/signup",
        json={
            "first_name": "Coach",
            "last_name": "User",
            "email": f"{uuid4()}@coach.com",
            "phone": "9999988888",
            "password": "Password@123",
            "role": "Coach"
        }
    )

    res = client.get("/users/role/Coach")
    assert res.status_code == 200
    users = res.json()
    assert isinstance(users, list)
    assert any(u["role"] == "Coach" for u in users)


def test_delete_user_admin_flow():
    # 1. Non-admin signup & login
    user_email = f"{uuid4()}@member.com"
    signup = client.post(
        "/auth/signup",
        json={
            "first_name": "Delete",
            "last_name": "Me",
            "email": user_email,
            "phone": "7777777777",
            "password": "Password@123",
            "role": "Member"
        }
    )
    target_user_id = signup.json()["user"]["id"]

    # 2. Login as admin
    admin_email = f"{uuid4()}@admin.com"
    admin_signup = client.post(
        "/auth/signup",
        json={
            "first_name": "System",
            "last_name": "Admin",
            "email": admin_email,
            "phone": "1111111111",
            "password": "Password@123",
            "role": "Admin"
        }
    )
    admin_token = admin_signup.json()["access_token"]
    user_token = signup.json()["access_token"]

    # 3. Non-admin try delete (should be 403 Forbidden)
    forbidden_res = client.delete(
        f"/users/{target_user_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert forbidden_res.status_code == 403

    # 4. Admin delete success (204 No Content)
    delete_res = client.delete(
        f"/users/{target_user_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert delete_res.status_code == 204

    # 5. Delete unknown user as admin (404)
    not_found_res = client.delete(
        f"/users/{uuid4()}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert not_found_res.status_code == 404
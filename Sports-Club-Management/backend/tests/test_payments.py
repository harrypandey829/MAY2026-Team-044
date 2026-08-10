from uuid import uuid4
from tests.conftest import client

def test_payment_lifecycle():
    user_id = str(uuid4())

    # 1. Create payment invoice
    create_res = client.post(
        "/payments",
        json={
            "member_id": user_id,
            "amount": 1500.00,
            "payment_model": "Monthly",
            "invoice_status": "Pending",
            "due_date": "2026-09-01",
            "paid_date": None
        }
    )
    assert create_res.status_code == 201
    payment_data = create_res.json()
    payment_id = payment_data["id"]
    assert payment_data["member_id"] == user_id
    assert payment_data["invoice_status"] == "Pending"

    # 2. Get payment by ID
    get_res = client.get(f"/payments/{payment_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == payment_id

    # 3. Update payment status to Paid
    update_res = client.put(
        f"/payments/{payment_id}",
        json={
            "amount": 1500.00,
            "payment_model": "Monthly",
            "invoice_status": "Paid",
            "due_date": "2026-09-01",
            "paid_date": "2026-08-10"
        }
    )
    assert update_res.status_code == 200
    assert update_res.json()["invoice_status"] == "Paid"


def test_get_unknown_payment():
    response = client.get(f"/payments/{uuid4()}")
    assert response.status_code == 404


def test_get_all_payments():
    response = client.get("/payments")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_unknown_payment():
    response = client.put(
        f"/payments/{uuid4()}",
        json={
            "amount": 1200,
            "payment_model": "Monthly",
            "invoice_status": "Paid",
            "due_date": "2026-08-01",
            "paid_date": "2026-08-01"
        }
    )
    assert response.status_code == 404


def test_create_payment_invalid_payload():
    response = client.post(
        "/payments",
        json={}
    )
    assert response.status_code == 422
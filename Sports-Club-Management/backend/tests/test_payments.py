from uuid import uuid4
from tests.conftest import client

def test_get_unknown_payment():
    response = client.get(f"/payments/{uuid4()}")
    assert response.status_code == 404

def test_get_all_payments():
    response = client.get("/payments")
    assert response.status_code == 200

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
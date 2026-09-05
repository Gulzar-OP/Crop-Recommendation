from fastapi.testclient import TestClient

from api.main import INTERNAL_API_KEY, app

client = TestClient(app)


def payload():
    return {"N": 90, "P": 42, "K": 43, "temperature": 20.87, "humidity": 82, "ph": 6.5, "rainfall": 202.93}


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["crop_classes"] == 22


def test_private_prediction_rejects_missing_key():
    assert client.post("/predict", json=payload()).status_code == 401


def test_ann_predicts_rice():
    response = client.post("/predict", json=payload(), headers={"x-internal-api-key": INTERNAL_API_KEY})
    assert response.status_code == 200
    assert response.json()["recommended_crop"] == "rice"
    assert len(response.json()["alternatives"]) == 2


def test_validation_rejects_invalid_humidity():
    data = payload()
    data["humidity"] = 140
    response = client.post("/predict", json=data, headers={"x-internal-api-key": INTERNAL_API_KEY})
    assert response.status_code == 422

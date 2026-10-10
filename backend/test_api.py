import os
import sys
import io
import time
import requests

BASE_URL = os.getenv("API_URL", "http://127.0.0.1:8000")

def test_health():
    print("\n--- TEST: /api/health ---")
    res = requests.get(f"{BASE_URL}/api/health", timeout=5)
    print("Status:", res.status_code)
    data = res.json()
    print("Response:", data)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert data.get("status") == "ok", "Expected status 'ok'"
    print("PASS: /api/health")

def test_model_health():
    print("\n--- TEST: /api/health/model ---")
    res = requests.get(f"{BASE_URL}/api/health/model", timeout=10)
    print("Status:", res.status_code)
    data = res.json()
    print("Response:", data)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert data.get("status") == "ok", "Expected model status 'ok'"
    print("PASS: /api/health/model")

def test_sample_observation():
    print("\n--- TEST: /api/sample-observation ---")
    t0 = time.time()
    res = requests.get(f"{BASE_URL}/api/sample-observation", timeout=5)
    elapsed = time.time() - t0
    print(f"Status: {res.status_code} ({elapsed*1000:.1f}ms)")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data.get("status") == "success", "Expected status success"
    assert data.get("is_demo") is True, "Expected is_demo True"
    assert "Demo Mode" in data.get("demo_disclaimer", ""), "Expected Demo Mode disclaimer"
    obs = data.get("observation", {})
    assert obs.get("title"), "Expected observation title"
    assert obs.get("type"), "Expected observation type"
    assert obs.get("description"), "Expected observation description"
    assert obs.get("look_closer"), "Expected observation look_closer"
    print("Sample:", obs.get("title"))
    print("PASS: /api/sample-observation")

def test_demo_query_analyze(image_path):
    print("\n--- TEST: /api/analyze?demo=true ---")
    assert os.path.exists(image_path), f"Test image {image_path} does not exist"
    t0 = time.time()
    with open(image_path, "rb") as f:
        res = requests.post(
            f"{BASE_URL}/api/analyze?demo=true",
            files={"file": (os.path.basename(image_path), f, "image/png")},
            timeout=10
        )
    elapsed = time.time() - t0
    print(f"Status: {res.status_code} ({elapsed*1000:.1f}ms)")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data.get("is_demo") is True, "Expected is_demo True"
    assert data.get("status") == "success", "Expected status success"
    obs = data.get("observation", {})
    assert obs.get("title"), "Expected observation title"
    print("Demo Observation:", obs.get("title"))
    print("PASS: /api/analyze?demo=true")

def test_invalid_image():
    print("\n--- TEST: /api/analyze with invalid image ---")
    garbage_bytes = b"not a real image payload"
    res = requests.post(
        f"{BASE_URL}/api/analyze",
        files={"file": ("fake.png", io.BytesIO(garbage_bytes), "image/png")},
        timeout=10
    )
    print("Status:", res.status_code)
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    print("PASS: /api/analyze invalid image handled safely with HTTP 400")

def test_empty_image():
    print("\n--- TEST: /api/analyze with empty image ---")
    res = requests.post(
        f"{BASE_URL}/api/analyze",
        files={"file": ("empty.jpg", io.BytesIO(b""), "image/jpeg")},
        timeout=10
    )
    print("Status:", res.status_code)
    assert res.status_code == 400, f"Expected 400, got {res.status_code}"
    print("PASS: /api/analyze empty image handled safely with HTTP 400")

if __name__ == "__main__":
    orchid_path = os.path.join(os.path.dirname(__file__), "test_assets", "orchid.png")
    
    print("=== STARTING WALKAROUND BACKEND VERIFICATION ===")
    test_health()
    test_model_health()
    test_sample_observation()
    test_demo_query_analyze(orchid_path)
    test_invalid_image()
    test_empty_image()
    print("\n=== ALL BACKEND TESTS PASSED SUCCESSFULLY ===")

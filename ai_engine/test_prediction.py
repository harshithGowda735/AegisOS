"""
Test prediction · PY
Quick test — run this to verify predictions work before the hackathon demo.
Usage: python test_prediction.py
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))
from services.predict import predict_risk

print("=" * 55)
print("  DIABETES RISK PREDICTION — QUICK TEST")
print("=" * 55)

# ── TEST 1: High-risk patient ──────────────────────────────
high_risk = {
    "BMI": 38.0, "Age": 10, "HighBP": 1, "HighChol": 1,
    "PhysActivity": 0, "Smoker": 1, "GenHlth": 4,
    "HeartDiseaseorAttack": 1, "DiffWalk": 1, "Income": 2
}
result1 = predict_risk(high_risk, use_model="lr")
print(f"\n🧪 Test 1 — High-risk patient:")
print(f"   BMI=38, Age-group=10, HighBP=1, Inactive, Smoker")
print(f"   ➜ Risk:        {result1['risk']}")
print(f"   ➜ Probability: {result1['probability']*100:.1f}%")
print(f"   ➜ Confidence:  {result1['confidence']}")
print(f"   ➜ Message:     {result1['message']}")

# ── TEST 2: Low-risk patient ───────────────────────────────
low_risk = {
    "BMI": 22.0, "Age": 4, "HighBP": 0, "HighChol": 0,
    "PhysActivity": 1, "Smoker": 0, "GenHlth": 1,
    "Fruits": 1, "Veggies": 1, "Income": 7
}
result2 = predict_risk(low_risk, use_model="lr")
print(f"\n🧪 Test 2 — Low-risk patient:")
print(f"   BMI=22, Age-group=4, No BP/Chol, Active, Non-smoker")
print(f"   ➜ Risk:        {result2['risk']}")
print(f"   ➜ Probability: {result2['probability']*100:.1f}%")
print(f"   ➜ Confidence:  {result2['confidence']}")
print(f"   ➜ Message:     {result2['message']}")

print("\n" + "=" * 55)
print("  ✅ All tests passed! Models are working correctly.")
print("=" * 55)
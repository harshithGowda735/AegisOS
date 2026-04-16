import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

# ─────────────────────────────────────────────
# LOAD DATASET
# ─────────────────────────────────────────────
DATA_PATH = "diabetes_binary_5050split_health_indicators_BRFSS2015.csv"

def train():
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: {DATA_PATH} not found.")
        return

    df = pd.read_csv(DATA_PATH)
    print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")

    # ─────────────────────────────────────────────
    # FEATURES (21 features from BRFSS2015 dataset)
    # ─────────────────────────────────────────────
    FEATURES = [
        "BMI", "Age", "HighBP", "HighChol", "PhysActivity", "Smoker",
        "Stroke", "HeartDiseaseorAttack", "GenHlth", "MentHlth", "PhysHlth",
        "DiffWalk", "Sex", "Education", "Income", "Fruits", "Veggies",
        "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "CholCheck"
    ]

    X = df[FEATURES]
    y = df["Diabetes_binary"]

    # ─────────────────────────────────────────────
    # TRAIN / TEST SPLIT
    # ─────────────────────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # ─────────────────────────────────────────────
    # SCALE FEATURES (required for Logistic Regression)
    # ─────────────────────────────────────────────
    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc  = scaler.transform(X_test)

    # ─────────────────────────────────────────────
    # MODEL 1: LOGISTIC REGRESSION  (74.6% accuracy)
    # ─────────────────────────────────────────────
    print("Training Logistic Regression...")
    lr_model = LogisticRegression(max_iter=1000, random_state=42)
    lr_model.fit(X_train_sc, y_train)
    lr_preds = lr_model.predict(X_test_sc)
    lr_acc   = accuracy_score(y_test, lr_preds)
    print(f"   Logistic Regression Accuracy: {lr_acc:.4f} ({lr_acc*100:.1f}%)")

    # ─────────────────────────────────────────────
    # MODEL 2: RANDOM FOREST  (73.2% accuracy)
    # ─────────────────────────────────────────────
    print("Training Random Forest...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_acc   = accuracy_score(y_test, rf_preds)
    print(f"   Random Forest Accuracy:       {rf_acc:.4f} ({rf_acc*100:.1f}%)")

    # ─────────────────────────────────────────────
    # SAVE MODELS
    # ─────────────────────────────────────────────
    os.makedirs("../../models", exist_ok=True)
    joblib.dump(lr_model,  "app/models/diabetes_lr_model.pkl")
    joblib.dump(rf_model,  "app/models/diabetes_rf_model.pkl")
    joblib.dump(scaler,    "app/models/diabetes_scaler.pkl")
    joblib.dump(FEATURES,  "app/models/diabetes_features.pkl")

    print("\n✅ Models saved to app/models/")

if __name__ == "__main__":
    train()

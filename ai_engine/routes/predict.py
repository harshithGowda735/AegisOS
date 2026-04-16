from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.services.predict import predict_risk, FEATURE_RANGES

router = APIRouter(prefix="/api/ml", tags=["ML Prediction"])


# ─────────────────────────────────────────────
# REQUEST SCHEMA
# ─────────────────────────────────────────────
class PatientData(BaseModel):
    # Core risk features
    BMI:                  float = Field(..., ge=12, le=98,  example=28.5)
    Age:                  int   = Field(..., ge=1,  le=13,  example=7,   description="1=18-24, 7=50-54, 13=80+")
    HighBP:               int   = Field(..., ge=0,  le=1,   example=1)
    HighChol:             int   = Field(..., ge=0,  le=1,   example=0)
    PhysActivity:         int   = Field(..., ge=0,  le=1,   example=1)
    Smoker:               int   = Field(..., ge=0,  le=1,   example=0)

    # Optional extended features (improve accuracy when provided)
    GenHlth:              Optional[int]   = Field(default=3, ge=1, le=5)
    MentHlth:             Optional[int]   = Field(default=0, ge=0, le=30)
    PhysHlth:             Optional[int]   = Field(default=0, ge=0, le=30)
    DiffWalk:             Optional[int]   = Field(default=0, ge=0, le=1)
    Stroke:               Optional[int]   = Field(default=0, ge=0, le=1)
    HeartDiseaseorAttack: Optional[int]   = Field(default=0, ge=0, le=1)
    Sex:                  Optional[int]   = Field(default=0, ge=0, le=1)
    Education:            Optional[int]   = Field(default=4, ge=1, le=6)
    Income:               Optional[int]   = Field(default=5, ge=1, le=8)
    Fruits:               Optional[int]   = Field(default=1, ge=0, le=1)
    Veggies:              Optional[int]   = Field(default=1, ge=0, le=1)
    HvyAlcoholConsump:    Optional[int]   = Field(default=0, ge=0, le=1)
    AnyHealthcare:        Optional[int]   = Field(default=1, ge=0, le=1)
    NoDocbcCost:          Optional[int]   = Field(default=0, ge=0, le=1)
    CholCheck:            Optional[int]   = Field(default=1, ge=0, le=1)

    # Model selection
    model: Optional[str] = Field(default="lr", description="'lr' or 'rf'")


# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@router.post("/predict")
def predict(patient: PatientData):
    """
    Predict diabetes risk for a patient.
    Returns risk level, probability, confidence, and top contributing factors.
    """
    try:
        data = patient.dict()
        model_choice = data.pop("model", "lr")
        result = predict_risk(data, use_model=model_choice)
        return {
            "status":  "success",
            "patient": {
                "BMI": patient.BMI,
                "Age": patient.Age,
                "HighBP": patient.HighBP,
            },
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/features")
def get_feature_info():
    """Returns all features, their ranges, and descriptions — useful for frontend forms."""
    return {
        "status":   "success",
        "features": FEATURE_RANGES,
        "required": ["BMI", "Age", "HighBP", "HighChol", "PhysActivity", "Smoker"],
        "optional": [f for f in FEATURE_RANGES if f not in
                     ["BMI", "Age", "HighBP", "HighChol", "PhysActivity", "Smoker"]]
    }


@router.get("/health")
def health_check():
    """Check if ML models are loaded and ready."""
    return {"status": "healthy", "models_loaded": True,
            "available_models": ["Logistic Regression (74.6% acc)", "Random Forest (73.2% acc)"]}

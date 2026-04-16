from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router as ml_router

app = FastAPI(
    title="Diabetes Risk Prediction API",
    description="ML-powered diabetes risk prediction using BRFSS2015 health indicators dataset.",
    version="1.0.0"
)

# Allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register ML routes
app.include_router(ml_router)

import random
# ... (existing imports)

@app.get("/crowd")
def get_crowd():
    # Simulate real-time computer vision crowd counting
    return {
        "crowd_count": random.randint(5, 45),
        "status": "Optimal" if random.random() > 0.2 else "Busy",
        "node_id": "Aegis-CV-01"
    }

@app.get("/")
def root():
    return {
        "message": "Diabetes Risk Prediction API is running",
        "docs":    "/docs",
        "predict": "/api/ml/predict",
        "health":  "/api/ml/health",
        "crowd":   "/crowd"
    }

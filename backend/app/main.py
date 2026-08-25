from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.weather import router as weather_router

app = FastAPI(
    title="sih_project API",
    description="AI-powered agriculture decision platform with live weather forecasting",
    version="1.0.0",
)

# CORS setup for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather_router)


@app.get("/")
def root():
    return {
        "message": "sih_project API is running",
        "weather_api": "/api/weather/forecast",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
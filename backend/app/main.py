from fastapi import FastAPI

app = FastAPI(
    title="sih_project API",
    description="AI-powered agriculture decision platform",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "sih_project API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
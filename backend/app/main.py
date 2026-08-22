from fastapi import FastAPI

app = FastAPI(
    title="KrishiSetu AI API",
    description="AI-powered agriculture decision platform",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "KrishiSetu AI API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
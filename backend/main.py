from fastapi import FastAPI
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(title="RollCall API")

app.include_router(api_router)
@app.get("/health")
def health():
    return {"status": "ok", "debug": settings.debug}


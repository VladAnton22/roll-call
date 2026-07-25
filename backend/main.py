from fastapi import FastAPI
from app.core.config import settings
from app.api.router import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RollCall API")

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "debug": settings.debug}

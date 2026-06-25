import os

import psycopg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="RollCall API")

# Lets the Vite dev server (running natively on :5173) call this API on :8000.
# allow_credentials=True is forward-looking for the httpOnly refresh-cookie auth later.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get("DATABASE_URL", "")


@app.get("/")
def root():
    return {"service": "rollcall-api", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def health_db():
    # Sync endpoint (def, not async) → FastAPI runs it in a threadpool,
    # so a plain blocking psycopg connect is fine for this proof-of-life.
    try:
        with psycopg.connect(DATABASE_URL, connect_timeout=3) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
                cur.fetchone()
        return {"database": "ok"}
    except Exception as exc:
        return JSONResponse(
            status_code=503,
            content={"database": "error", "detail": str(exc)},
        )
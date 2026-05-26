# RollCall

A progress tracking app for Brazilian Jiu-Jitsu practitioners. Rate your techniques, visualise your game, and identify where you're strong and where you need work.

> 🚧 Currently in active development — MVP in progress.

---
 
## What It Does
 
BJJ progress is hard to measure. RollCall gives you a structured way to audit your game:
 
- **Rate every technique** in your arsenal using a 1–5 skill rating and a Low/Medium/High confidence score
- **Visualise your game** with a radar chart across categories (guard, passing, submissions, escapes, etc.)
- **Log training sessions** to track volume and notes over time
- **Identify weak points** at a glance — so you know exactly what to drill next

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Auth | JWT (access token + httpOnly refresh cookie) |
| Payments | Stripe |

---

## Getting Started (Local Dev)
 
### Prerequisites
 
- Node.js 18+
- Python 3.11+
- Docker + Docker Compose

### 1. Clone the repo
 
```bash
git clone https://github.com/VladAnton22/rollcall.git
cd rollcall
```
 
### 2. Set up environment variables
 
```bash
cp .env.example .env
# Fill in the values in .env
```
 
### 3. Start everything with Docker Compose
 
```bash
docker-compose up
```
 
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

---
 
## MVP Roadmap
 
- [x] Technique library UI
- [ ] Ratings persistence (localStorage → PostgreSQL)
- [ ] Progress visualisation (radar chart)
- [ ] Session logging
- [ ] User auth + accounts
- [ ] Subscription tier (Stripe)
---
 
## Licence
 
[MIT](LICENSE)
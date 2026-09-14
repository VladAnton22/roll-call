# RollCall

A Brazilian Jiu-Jitsu technique tracker and progress dashboard, built as a portfolio project to run on a prduction **AWS** architecture - full stack app, containerized, deployed on ECS Fargate behind CloudFront.

> **Status** MVP complete and deployed to production. See [Roadmap](#roadmap) for what's done vs. planned.

---
 
## Features
 
- [x] Technique Library organised by category (Standing, Submissions, Guards, Passes, Sweeps, Escapes, Concepts)
- [x] Per-technique self-assessment: 1-5 proficiency rating with low/medium/high confidence
- [x] Training-session logging - technique tagging, gi/no-gi, duration, notes
- [x] Progress dashboard - paired bars (proficiency vs. practice per category) and a rating heatmap (red->green)
- [x] JWT auth - access token + `httpOnly` refresh-token cookie, `/register`, `/refresh`, `/logout`
- [x] Rate limiting on auth endpoints (`/tokens`, `/register`)
- [x] Production AWS deployment (ECS Fargate, RDS, CloudFront, ALB) in a 3-tier VPC
- [x] Cost-control tooling - scripted teardown/spin-up of expensive idle resources
- [x] Custom domain + end-to-end HTTPS
- [ ] CI/CD pipeline (Github Actions -> ECR -> ECS)
- [ ] Infrastructure as code (Terraform)
- [ ] Refresh-token revocation


---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic, Alembic, PyJWT, pwdlib/Argon2, slowapi |
| Database | PostgreSQL |
| Packaging | Docker (multi-stage), Docker Compose, uv |
| Cloud (eu-west-1) | ECS Fargate, RDS PostgreSQL, ALB, CloudFront, S3, NAT Gateway, Secrets Manager, ECR, IAM, CloudTrail, Organizations |

---

## Build and Run

Everything runs through Docker Compose (FastAPI + PostgreSQL):
 
```
docker compose --build
```
 
Apply database migrations and seed the technique catalog:
 
```
alembic upgrade head
```
 
Frontend dev server:
 
```
cd frontend
npm install
npm run dev
```
 
> The Vite dev proxy mirrors CloudFront's path-based routing, so there are no CORS concerns in local development.

**Requirements:** Docker, uv, Node.js.

---
 
## Architecture
 
Single region deployment in `eu-west-1`, frontend by one CloudFront distribution that path-routes between the static frontend and the API.

- **VPC:** 6 subnets across a 3-tier layout (public / app / data) over 2 AZs.
- **Compute & data isolation:** the Fargate task and RDS live only in private subnets. Outbound access (e.g. pulling secrets, image layers) goes through a NAT Gateway.
- **Secrets:** application secrets are stored in Secrets Manager and injected via an IAM execution role - nothing sensitive in the images or task definitions.
- **Accounts:** an AWS Organizations setup separates the management account (org + identity only) from the production account, accessed via role switching.

---

## Design decisions & tradeoffs

### Why ECS ECS Fargate rather than EC2?

Fargate runs the container without a server to patch, size or babysit. This suits a single-task workload where operational overhead matters more than squeezing out per-instance cost. The tradeoff is less control over the host and a higher per-vCPU price than a reserved instance. This is acceptable here because the service is torn down when idle rather than run 24/7.

### Why split resources into "persistent" and "ephemeral"?

The costly parts of the stack - NAT Gateway, ALB, the ECS service, and RDS compute - bill by the hour whether or not anyone is using the app. For a portfolio project with almost no real traffic, that's pure waste. Everything that's cheap to keep and painful to create (S3, CloudFront, ECR, RDS storage) stays up permanently. Everything expensive and quick to recreate is provisioned on demand via `up.sh``down.sh`. Idle cost drops significantly without losing the "it's really depolyed" story.

### Why sync SQLAlchemy 2.0 instead of async?

The workload is low-concurrency and the queries are simple, so the async event-loop buys little here while adding complexity to every dependency. Sync ORM code is easier to read, test and debug. Async is the kind of change to make when a real bottleneck appears, not up front.

### Security notes

- **Auth tokens** - short lived access tokens in memory; refresh token is an `httpOnly` cookie so there is no danger of cross-site scripting.
- **Rate limiting** - `slowapi` caps requests on `/token` and `/register` to stop credential stuffing.
- **Password storage** - Argon2 via pwdlib.
- **Network** - API and database sit in private subnets with no public ingress. Only the ALB is internet facing.
- **Least privilege** - the ECS execution role grands only what is needed to pull images and read the app's own secrets.

---

## Roadmap

**Done - MVP:** local Docker Compose env -> core technique + rating API -> React frontend -> session logging -> progress dashboard -> JWT auth -> full AWS deployment.

**Next - hardening & automation:**
- CI/CD via Github Actions using OIDC (no long-lived AWS credentials)
- Terraform migration with a `presistent/` vs `ephemeral/` split
- Refresh-token revocation
- Move rate-limit state to Redis/ElastiCache

**Later - v2/v2:** roll/sparring tracking, competition tracking, coach/team features, video attachments, social login.

---
 
## Licence
 
[MIT](License)

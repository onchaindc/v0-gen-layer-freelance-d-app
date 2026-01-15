# GenLayer Freelance dApp (AI Escrow)

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/onchaindcs-projects/v0-gen-layer-freelance-d-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/mW3yEeOWUfZ)

---

## Overview

This project explores an **AI-driven escrow flow for freelancers built on GenLayer Intelligent Contracts**.

High-level flow:

- Client posts a job (brief, budget, deadline)
- Freelancer submits a delivery URL
- Anyone can trigger a judgment step
- GenLayer validators evaluate the submission against the brief using external data
- Contract state updates based on validator consensus:
  - **APPROVED** → delivery accepted
  - **REVISION** → feedback returned
  - **FAILED** → delivery rejected

---

## Intelligent Contract

The GenLayer Intelligent Contract source is included in this repository:

- `contracts/ai_escrow.py`

The contract is written in Python and runs inside **GenVM** via GenLayer Studio.

### Core Contract Methods

**Write methods**
- `post_job(brief: str, budget: u256, deadline: str) -> u256`  
  Creates a new job and returns a `job_id`.

- `submit_delivery(job_id: u256, url: str)`  
  Submits a delivery URL for a given job.

- `judge(job_id: u256) -> str`  
  Triggers non-deterministic evaluation using external data and validator consensus.

**Read methods**
- `get_status(job_id: u256) -> str`
- `get_feedback(job_id: u256) -> str`
- `get_submission_url(job_id: u256) -> str`
- `get_brief(job_id: u256) -> str`

---

## Running the Intelligent Contract (GenLayer Studio)

### Prerequisites
- Docker 26+
- Node.js 18+

### Start GenLayer locally
```bash
npm i -g genlayer
genlayer init
genlayer up
```

---

## Deployment

Your project is live at:

**[https://vercel.com/onchaindcs-projects/v0-gen-layer-freelance-d-app](https://vercel.com/onchaindcs-projects/v0-gen-layer-freelance-d-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/mW3yEeOWUfZ](https://v0.app/chat/mW3yEeOWUfZ)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

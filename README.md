# KrishiMitra AI — Python ML + MERN

Full-stack crop recommendation system with a private TensorFlow inference service and a public MERN application.

## Architecture

~~~text
React + Tailwind (5173)
          |
          v
Node.js + Express API (8000) ---> MongoDB (27017)
          |
          v
Python + FastAPI ML service (8001) ---> trained ANN model
~~~

The browser never calls Python directly. Node authenticates the user, validates input, calls the private ML endpoint, and stores the recommendation in MongoDB.

## Features

- TensorFlow ANN trained on the Crop Recommendation dataset
- React, Vite, Tailwind CSS and responsive multi-page dashboard
- Node.js, Express, Mongoose and MongoDB
- Register, login, logout and current-user endpoints
- bcrypt password hashing and JWT HttpOnly cookies
- Authentication rate limiting, Helmet and CORS
- Per-user recommendation history and deletion
- Internal API key between Node and Python
- Docker Compose for the complete application

## Quick start with Docker

~~~bash
cp .env.example .env
# Put a long random value in JWT_SECRET
docker compose up --build
~~~

Open http://localhost:5173.

## Manual development

### 1. MongoDB

~~~bash
docker compose up -d mongodb
~~~

### 2. Python ML service

Use Python 3.11 or 3.12.

~~~bash
python3.12 -m venv .venv
source .venv/bin/activate

# Apple Silicon / macOS
pip install -r requirements-macos.txt

# Linux / Windows
# pip install -r requirements-linux.txt

export ML_INTERNAL_API_KEY=development-ml-key
uvicorn api.main:app --reload --port 8001
~~~

### 3. Node backend

~~~bash
cd backend
cp .env.example .env
npm install
npm run dev
~~~

### 4. React frontend

~~~bash
cd frontend
cp .env.example .env
npm install
npm run dev
~~~

## Public Node API

~~~text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
POST   /api/v1/recommendations
GET    /api/v1/recommendations/history
DELETE /api/v1/recommendations/history/:id
GET    /api/v1/health
~~~

## Private Python API

~~~text
GET  /health
POST /predict
~~~

POST /predict requires the x-internal-api-key header.

## Tests and builds

~~~bash
PYTHONPATH=. pytest -q tests
cd backend && npm run check
cd frontend && npm run build
~~~

The output is decision support. Validate recommendations using local field conditions and agricultural guidance before cultivation.

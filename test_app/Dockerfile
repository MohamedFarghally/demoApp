# Multi-stage Dockerfile for MediCare Portal
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend with static files
FROM python:3.11-slim

WORKDIR /app

# Install Node.js for serving (optional) and other dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy and install backend dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist ./static

# Expose ports
EXPOSE 8000

# Run both services (backend serves API, you can add nginx for production)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

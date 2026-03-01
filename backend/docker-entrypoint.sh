#!/bin/sh
set -e

# Run the FastAPI application
exec uvicorn main:app --host 0.0.0.0 --port 8000

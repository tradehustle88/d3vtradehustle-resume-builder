from fastapi import FastAPI

# Create the app instance
app = FastAPI(
    title="Fast Docs",
    description="⚡ A super-fast documentation system with search, stats, and JSON export",
    version="1.0.0"
)

# Root route
@app.get("/")
def read_root():
    return {"message": "Fast Docs is running!"}

# Example endpoint for testing
@app.get("/hello")
def say_hello(name: str = "hustler"):
    return {"message": f"Hello, {name}! 🚀"}

# You automatically get:
# - Swagger UI at /docs
# - Redoc UI at /redoc
# - OpenAPI JSON at /openapi.json
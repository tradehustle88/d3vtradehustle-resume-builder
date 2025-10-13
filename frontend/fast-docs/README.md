# Fast Docs

⚡ A super-fast documentation system with search, stats, and JSON export

## Getting Started

### 1. Install Dependencies

First, make sure you have Python 3.7+ installed. Then install the required packages:

```bash
pip install -r requirements.txt
```

### 2. Run the Application

From inside the `fast-docs` folder, run:

```bash
uvicorn run:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access the Documentation

Once the server is running, you can access:

- **API Root**: http://localhost:8000/
- **Swagger UI**: http://localhost:8000/docs
- **Redoc UI**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Example Endpoints

- `GET /` - Root endpoint returning a welcome message
- `GET /hello` - Hello endpoint with optional name parameter
- `GET /hello?name=YourName` - Personalized hello message

## Features

✅ **Auto-generated Documentation**: FastAPI automatically generates:
- Interactive Swagger UI at `/docs`
- Alternative Redoc documentation at `/redoc`
- OpenAPI JSON schema at `/openapi.json`

✅ **Hot Reload**: The `--reload` flag enables automatic reloading when you make changes to the code

✅ **Type Safety**: FastAPI uses Python type hints for automatic validation and documentation

## Development

The main application is in `run.py`. Add new endpoints by creating functions with FastAPI decorators:

```python
@app.get("/new-endpoint")
def new_endpoint():
    return {"message": "New endpoint"}
```

FastAPI will automatically update the documentation when you add new endpoints!
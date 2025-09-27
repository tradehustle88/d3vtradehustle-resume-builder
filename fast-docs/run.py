from fastapi import FastAPI

app = FastAPI(title="Fast Docs System")

@app.get("/")
def read_root():
    return {"message": "Fast Docs is running!"}

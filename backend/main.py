from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to ResearchMind AI"}


@app.get("/")
def home():
    return {"message": "Welcome to ResearchMind AI"}
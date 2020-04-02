from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from routers import attachments, auth, feed, shows, users
from models import BaseModel
from db import engine

#BaseModel.metadata.drop_all(bind=engine)
BaseModel.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(attachments.router, prefix="/attachments")
app.include_router(feed.router, prefix="/feed")
app.include_router(shows.router, prefix="/shows")
app.include_router(users.router, prefix="/users")
app.include_router(auth.router)
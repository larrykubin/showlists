import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, Form, Request
from .auth import get_current_active_user
from pydantic import BaseModel
from models import Attachment, User, Show, ShowAttachment
from db import db
from .auth import get_current_user
from typing import List
from sqlalchemy import text

router = APIRouter()

@router.get("/")
async def feed():
    shows = db.query(Show).join(User).order_by(Show.created.desc()).limit(10).all()

    return {
        "code": "SUCCESS",
        "shows": shows
    }
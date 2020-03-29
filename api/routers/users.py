import schemas, sqlalchemy
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from models import Show, User, Attachment
from db import db
from .auth import get_current_user, get_current_active_user
from pydantic import BaseModel
from typing import List

router = APIRouter()
    
@router.get("/", response_model=List[schemas.User])
async def users():
    """
    browse all users on the site
    """
    users = db.query(User).all()

    return users

# @router.get("/user/{username}")
# def user_shows(username, current_user: str = Depends(get_current_active_user)):
#     """
#     returns shows for a particular user
#     """
#     print("hello user shows")
#     return [
#         "hello"
#     ]
    
#, 
@router.get("/{username}")
async def profile(username, current_user: str = Depends(get_current_active_user)):
    """
    show profile for a particular user
    """
    print("finding user")
    try:
        user = db.query(User).filter(User.username==username).one()
        print(user)
        num_attachments = db.query(Attachment).filter(Attachment.creator_id==user.id).count()
    except sqlalchemy.orm.exc.NoResultFound:
        return {
            "code": "error",
            "message": "No result found"
        }

    if not user:
        return {
            "code": "error",
            "message": "No result found"
        }
    

    shows = db.query(Show).filter(Show.creator_id==user.id).order_by(Show.date).all()

    return {
        "shows": shows,
        "num_shows": len(shows),
        "num_attachments": num_attachments,
        "user": user
    }


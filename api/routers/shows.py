import sqlalchemy
from fastapi import APIRouter, Depends
from models import Show
from db import db
from .auth import get_current_active_user, get_current_user
from pydantic import BaseModel

router = APIRouter()

class ShowRecord(BaseModel):
    artist: str
    venue: str
    city: str
    date: str
    festival: str

@router.post("/")
def create(show_record: ShowRecord, current_user: str = Depends(get_current_user)):
    """
    create a show record
    """

    try:
        show = Show()
        show.artist = show_record.artist
        show.venue = show_record.venue
        show.city = show_record.city
        show.date = show_record.date
        show.festival = show_record.festival
        show.creator_id = current_user.id
        
        db.add(show)
        db.commit()
    except sqlalchemy.exc.IntegrityError:
        return {
            "code": "error",
            "message": "User already exists with that username or email"
        }
    except Exception as e:
        print(e)

    return {
        "code": "SUCCESS"
    }

@router.get("/{id}")
def read(id: int):
    """
    returns a single show by id
    """
    show = db.query(Show).filter(Show.id==id).one()

    return {
        "show": show
    }

@router.put("/{show_id}")
def update(show_id, show_record: ShowRecord, current_user: str = Depends(get_current_user)):
    """
    update a single show by id, must own the show to update it
    """
    print(show_id)
    show = db.query(Show).filter(Show.id==show_id).one()
    
    show.artist = show_record.artist
    show.venue = show_record.venue
    show.city = show_record.city
    show.date = show_record.date
    show.festival = show_record.festival

    db.add(show)
    db.commit()

    return {
        "update": True
    }

@router.delete("/{id}")
def delete(id: int):
    """
    delete a single show by id
    """
    db.query(Show).filter(Show.id==id).delete()
    db.commit()

    return {
        "delete": True
    }


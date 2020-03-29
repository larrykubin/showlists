from pydantic import BaseModel
from typing import List

class User(BaseModel):
    username: str

    class Config:
        orm_mode = True

class Show(BaseModel):
    artist: str

class Profile(BaseModel):
    user: User
    shows: List[Show]

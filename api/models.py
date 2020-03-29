import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship, backref

BaseModel = declarative_base()

class User(BaseModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    shows = relationship("Show", secondary="user_shows")


class Show(BaseModel):
    __tablename__ = "shows"

    id = Column(Integer, primary_key=True, index=True)
    artist = Column(String, index=True)
    venue = Column(String, index=True)
    city = Column(String, index=True)
    date = Column(String, index=True)
    festival = Column(String, index=True)
    creator_id = Column(Integer, ForeignKey('users.id'))
    created = Column(DateTime, default=datetime.datetime.utcnow)

    users = relationship("User", secondary="user_shows")
    attachments = relationship("Attachment", secondary="show_attachments")

class UserShow(BaseModel):
    __tablename__ = 'user_shows'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    show_id = Column(Integer, ForeignKey('shows.id'))
    notes = Column(String) # each user can have their own notes on the same show

    user = relationship(User, backref=backref("users"))
    show = relationship(Show, backref=backref("shows"))

class Attachment(BaseModel):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    url = Column(String)
    notes = Column(String)
    active = Column(Boolean, default=False)
    creator_id = Column(Integer, ForeignKey('users.id'))

    #users = relationship("User", secondary="user_shows")
    shows = relationship("Show", secondary="show_attachments")

class ShowAttachment(BaseModel):
    __tablename__ = "show_attachments"

    id = Column(Integer, primary_key=True, index=True)
    show_id = Column(Integer, ForeignKey('shows.id'))
    attachment_id = Column(Integer, ForeignKey('attachments.id'))

    show = relationship(Show, backref="show")
    attachment = relationship(Attachment, backref="attachment")

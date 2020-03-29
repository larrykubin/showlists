import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship, backref

engine = create_engine(os.getenv("DATABASE_URL"))

Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = Session()


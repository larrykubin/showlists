import jwt
import sqlalchemy
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from passlib.context import CryptContext
from jwt import PyJWTError
from models import User
from db import db

router = APIRouter()

SECRET_KEY = "d7c3dd3be6ad7ba653129316777c5b7e388d321aedcb90cb0c4a2af383da3151"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60

class UserRegistration(BaseModel):
    username: str
    password: str
    email: str

# class User(BaseModel):
#     username: str
#     email: str = None
#     full_name: str = None
#     disabled: bool = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str = None

class Auth(BaseModel):
    username: str
    password: str

class UserInDB(User):
    hashed_password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str):
    try:
        user = db.query(User).filter(User.username==username).one()
    except sqlalchemy.orm.exc.NoResultFound:
        return False
    
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    
    return user

def create_access_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.username==username).one()

    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    #if current_user.disabled:
    #    raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@router.post("/login", response_model=Token)
async def login(auth: Auth):
    user = authenticate_user(auth.username, auth.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": auth.username
    }


@router.post("/register")
async def register(user_registration: UserRegistration):
    """
    register a new user
    """
    try:
        user = User()
        user.username = user_registration.username
        user.email = user_registration.email
        user.hashed_password = get_password_hash(user_registration.password)

        db.add(user)
        db.commit()
    except sqlalchemy.exc.IntegrityError:
        return {
            "code": "error",
            "message": "User already exists with that username or email"
        }
    finally:
        db.rollback()

    # authenticate user and redirect to profile
    return {
        "code": "success",
        "message": "User registered successfully"
    }
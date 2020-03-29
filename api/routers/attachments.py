import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, Form, Request
from .auth import get_current_active_user
from pydantic import BaseModel
from models import Attachment, User, ShowAttachment
from db import db
from .auth import get_current_user
from typing import List

router = APIRouter()

class CompletedFiles(BaseModel):
    ids: List[int]

class FileUpload(BaseModel):
    filename: str
    contentType: str

s3_client = boto3.client('s3')

@router.post("/sign")
async def sign(fileUpload: FileUpload, current_user: User = Depends(get_current_user)):
    # create attachment record with status incomplete 
    # if upload success, callback from uppy
    try:
        attachment = Attachment()
        attachment.filename = fileUpload.filename
        attachment.creator_id = current_user.id
        db.add(attachment)
        db.commit()

        bucket_name = 'showlists'
        object_name = 'shows/{}'.format(attachment.id)
        response = s3_client.generate_presigned_post(bucket_name,object_name)
    except ClientError as e:
        print(e)
        return None

    # The response contains the presigned URL and required fields
    return response

@router.post("/{show_id}/finish")
async def finish(show_id, completed_files: CompletedFiles, current_user: User = Depends(get_current_user)):
    print(completed_files)

    for id in completed_files.ids:
        #update attachment record and set it to active
        attachment = db.query(Attachment).filter(Attachment.id==id).one()
        attachment.active = True
        db.add(attachment)

        # add relationship to show
        show_attachment = ShowAttachment()
        show_attachment.attachment_id = id
        show_attachment.show_id = show_id
        db.add(show_attachment)

    db.commit()

    return {

    }

@router.get("/show/{id}")
def show_attachments(id: int):
    """
    returns attachments for a particular show
    """
    return [
        "hello"
    ]

@router.post("/create")
def create():
    """
    create an attachment record, upload media to s3
    """
    return {}

@router.get("/{id}")
def read(id: int):
    """
    returns a particular attachment
    """
    return {}

@router.put("/{id}")
def update(id: int):
    """
    update an attachment record, must own the attachment
    """
    return {}

@router.delete("/{id}")
def delete(id: int):
    """
    delete an attachment record, must own the attachment
    """
    return {}

from pydantic import BaseModel,ConfigDict,Field,EmailStr
from typing import Literal


class UserCreate(BaseModel):
    name:str = Field(min_length=2)
    email: EmailStr
    password:str = Field(min_length=6)


class UserResponse(BaseModel):
    id:int
    name:str
    email:str


class UserUpdate(BaseModel):
    name:str = Field(min_length=2)
    email: EmailStr


class JobCreate(BaseModel):
    title:str = Field(min_length=3)
    company:str = Field(min_length=2)
    description:str = Field(min_length=10)
    location:str = Field(min_length=2)


class JobResponse(BaseModel):
    id:int
    title:str
    company:str
    description:str
    location:str


class ApplicationCreate(BaseModel):
    job_id:int
    

class ApplicationStatusUpdate(BaseModel):
    status:Literal[ "accepted", "rejected", "withdrawn"]

class ApplicationResponse(BaseModel):
    id:int
    user_id:int
    job_id:int
    status:str
    job:JobResponse
  

    model_config = ConfigDict(from_attributes=True)
    
class Change_Password(BaseModel):
    current_password:str = Field(min_length=6)
    new_password:str = Field(min_length=6)

class TokenResponse(BaseModel):
    access_token:str
    token_type:str

class JobPaginationResponse(BaseModel):
    total:int
    page:int
    limit:int
    total_pages:int
    jobs:list[JobResponse]


class ApplicationPaginationResponse(BaseModel):
    total:int
    page:int
    limit:int
    total_pages:int
    applications:list[ApplicationResponse]


class JobApplicationPaginationResponse(BaseModel):
    total:int
    page:int
    limit:int
    total_pages:int
    applications:list[ApplicationResponse]
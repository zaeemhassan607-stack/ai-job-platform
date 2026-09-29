from fastapi import FastAPI,Depends,HTTPException,Query
from database import engine,Base,get_db
from models import User,Job,Application
from sqlalchemy.orm import Session
from schemas import UserCreate,JobCreate,ApplicationCreate,UserResponse,JobResponse,ApplicationResponse,UserUpdate,ApplicationStatusUpdate,Change_Password,TokenResponse,JobPaginationResponse,ApplicationPaginationResponse,JobApplicationPaginationResponse
from sqlalchemy import or_
from datetime import datetime,timedelta,timezone
from jose import jwt,JWTError
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
security = HTTPBearer()

from pwdlib import PasswordHash
hash_password = PasswordHash.recommended()

import os
from dotenv import load_dotenv
load_dotenv()
secret_key = os.getenv("secret_key")
ALGORITHM = "HS256"


from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"]
)
Base.metadata.create_all(bind=engine)






def Create_Token(id:int,email:str):
    payload = {
        "sub":str(id),
        "email":email,
        "exp":datetime.now(timezone.utc)+timedelta(minutes=30)
    }
    token = jwt.encode(
        payload,
        secret_key,
        algorithm=ALGORITHM
    )
    return token


# --------------------------------------------------------------


def Verify_Token(credentials:HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        data = jwt.decode(
            token,
            secret_key,
            algorithms=[ALGORITHM]
        )
        return data
    except JWTError:
         raise HTTPException(status_code=401, detail="Invalid Token")

        
# --------------------------------------------------------------
@app.post("/users",response_model=UserResponse)
def create_users(user:UserCreate,db:Session = Depends(get_db)):
    check_email = db.query(User).filter(User.email ==user.email).first()
    if check_email:
        raise HTTPException (status_code=400,detail="Email already exist")
    hashed_password = hash_password.hash(user.password)
    users = User(
        name = user.name,
        email = user.email,
        hashed_password = hashed_password
    )
    db.add(users)
    db.commit()
    db.refresh(users)
    return users


# --------------------------------------------------------------


@app.post("/jobs",response_model=JobResponse)
def create_jobs(job:JobCreate,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    user = db.query(User).filter(User.id ==user_id).first()
    if not user:
        raise HTTPException (status_code=404,detail="User not found")

    jobs = Job(
        title = job.title,
        company  = job.company,
        description = job.description,
        location = job.location,
        user_id = user_id
    )
    db.add(jobs)
    db.commit()
    db.refresh(jobs)
    return jobs


# --------------------------------------------------------------


@app.post("/applications",response_model=ApplicationResponse)
def create_applications(application:ApplicationCreate,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):

    user_id = int(token["sub"])
    find_user = db.query(User).filter(User.id == user_id).first()

    if not find_user:
        raise HTTPException (status_code=404, detail="User not found")
    
    find_job = db.query(Job).filter(Job.id == application.job_id).first()

    if not find_job:
        raise HTTPException (status_code=404, detail="Job not found")

    if find_job.user_id == user_id:
        raise HTTPException (status_code=400, detail="You cannot apply to your own job")
        

    check = db.query(Application).filter(
    Application.user_id == user_id,
    Application.job_id == application.job_id
).first()

    if check:
        raise HTTPException(
    status_code=400,
    detail="User already applied for this job"
)

    applications = Application(
        user_id = user_id,
        job_id = application.job_id,
        status = "pending"
    )
    db.add(applications)
    db.commit()
    db.refresh(applications)
    return applications



# --------------------------------------------------------------



@app.get("/jobs/{job_id}",response_model=JobResponse)
def job_by_id(job_id:int,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException (status_code=404, detail="Job not found")
    return job


# --------------------------------------------------------------


@app.get("/users",response_model=UserResponse)
def user_by_id(token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException (status_code=404, detail="User not found")
    return user


# --------------------------------------------------------------


@app.get("/applications/{application_id}",response_model=ApplicationResponse)
def application_by_id(application_id:int,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException (status_code=404, detail="Application not found")
    find_job = db.query(Job).filter(Job.id == application.job_id).first()
    if not find_job:
        raise HTTPException (status_code=404, detail="Job not found")

    if user_id != application.user_id and user_id != find_job.user_id:
        raise HTTPException (status_code=403, detail="Invalid User")

    return application


# --------------------------------------------------------------


@app.get("/users/applications",response_model=ApplicationPaginationResponse)
def user_jobs(sort:str = "newest",token:str = Depends(Verify_Token),page:int = Query(1,ge=1),limit:int = Query(10,ge=1,le=50),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    query = db.query(Application).filter(Application.user_id == user_id)
    total = query.count()
    total_pages = (total + limit - 1) // limit


    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException (status_code=404, detail="User not found")
    if sort not in ["newest","oldest"]:
        raise HTTPException (status_code=400, detail="Invalid Sort")
        
    if sort == "newest":
        application = db.query(Application).filter(Application.user_id == user_id).order_by(Application.id.desc()).offset((page-1)*limit).limit(limit).all()
    else:
        application = db.query(Application).filter(Application.user_id == user_id).order_by(Application.id.asc()).offset((page-1)*limit).limit(limit).all()

    return {
    "total": total,
    "page": page,
    "limit": limit,
    "total_pages": total_pages,
    "applications": application
}


# --------------------------------------------------------------


@app.get("/jobs/{job_id}/applications",response_model=JobApplicationPaginationResponse)
def job_applications(job_id:int,token:str = Depends(Verify_Token),sort:str = "newest",page:int = Query(1,ge=1),limit:int = Query(10,ge=1,le=50),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException (status_code=404, detail="Job not found")
    query = db.query(Application).filter(Application.job_id == job_id)
    total = query.count()
    total_pages = (total + limit - 1) // limit

    if not job.user_id == user_id:
        raise HTTPException (status_code=403, detail="Invalid user id")

    if sort not in ["newest","oldest"]:
        raise HTTPException (status_code=400, detail="Invalid sort")

    if sort == "newest":
        application = db.query(Application).filter(Application.job_id == job_id).order_by(Application.id.desc()).offset((page-1)*limit).limit(limit).all()
    else:
        application = db.query(Application).filter(Application.job_id == job_id).order_by(Application.id.asc()).offset((page-1)*limit).limit(limit).all()

    return {
    "total": total,
    "page": page,
    "limit": limit,
    "total_pages": total_pages,
    "applications": application
}


# --------------------------------------------------------------


@app.put("/jobs/{job_id}",response_model=JobResponse)
def update_job(job_id:int,update:JobCreate,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException (status_code=404, detail="User not found")
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException (status_code=404, detail="Job not found")
    if not job.user_id == user_id:
        raise HTTPException (status_code=403, detail="Invalid user")
        
    job.title = update.title
    job.company = update.company
    job.description = update.description
    job.location = update.location
    db.commit()
    db.refresh(job)
    return job



# --------------------------------------------------------------


@app.delete("/jobs/{job_id}")
def delete_job(job_id:int,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException (status_code=404, detail="Job not found")
    if not job.user_id == user_id:
        raise HTTPException (status_code=403, detail="You can only delete your own job")

    application = db.query(Application).filter(Application.job_id == job_id).all()
    for i in application:
        db.delete(i)


  
    db.delete(job)
    db.commit()


    return {
        "message":"Job deleted successfully"
    }


# --------------------------------------------------------------


@app.put("/applications/{application_id}",response_model=ApplicationResponse)
def update_application(application_id:int,status:ApplicationStatusUpdate,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException (status_code=404, detail="Application not found")
    find_job = db.query(Job).filter(Job.id == application.job_id).first()
    if not find_job:
        raise HTTPException (status_code=404, detail="Job not found")

    if status.status == "withdrawn":
        if user_id != application.user_id:
            raise HTTPException(status_code=403, detail="Only applicant can withdraw")
    elif status.status in["accepted","rejected"]:
        if user_id != find_job.user_id:
            raise HTTPException(status_code=403, detail="Only job owner can update status")
    else:
        raise HTTPException (status_code=403, detail="Invalid Status")
    if application.status != "pending":
        raise HTTPException (status_code=400, detail="Application can only be updated while status is pending")
    application.status = status.status
    db.commit()
    db.refresh(application)
    return application



# --------------------------------------------------------------

@app.delete("/applications/{application_id}")
def delete_application(application_id:int,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException (status_code=404, detail="Application not found")
    if not application.user_id == user_id:
        raise HTTPException (status_code=403, detail="Invalid Application")
    db.delete(application)
    db.commit()

    return {
        "message":"Application deleted successfully"
    }


# --------------------------------------------------------------

@app.put("/users/update",response_model=UserResponse)
def update_user(update:UserUpdate,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException (status_code=404, detail="User not found")
    existing_user = db.query(User).filter(User.email == update.email,User.id != user_id).first()
    if existing_user:
        raise HTTPException (status_code=400, detail="User already exist")
        
    user.name = update.name
    user.email = update.email
    db.commit()
    db.refresh(user)
    return user


# --------------------------------------------------------------

@app.delete("/users/delete")
def delete_user(token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException (status_code=404, detail="User not found")
    for i in user.applications:
        db.delete(i)
    for j in user.jobs:
        for k in j.applications:
            db.delete(k)
        db.delete(j)
    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }


# --------------------------------------------------------------


@app.get("/jobs/search/{keyword}",response_model=list[JobResponse])
def search_job(keyword:str,location:str|None=None,sort:str = "newest",page:int = Query(1,ge=1),limit:int = Query(10,ge=1,le=50),token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    keyword = f"%{keyword}%"
    if  sort  not in ["newest","oldest"]:
        raise HTTPException (status_code=400, detail="Invalid sort")

    if sort == "newest":
        query = db.query(Job).filter(or_(Job.title.ilike(keyword),Job.description.ilike(keyword),Job.location.ilike(keyword),Job.company.ilike(keyword))).order_by(Job.id.desc())
    else:
        query = db.query(Job).filter(or_(Job.title.ilike(keyword),Job.description.ilike(keyword),Job.location.ilike(keyword),Job.company.ilike(keyword))).order_by(Job.id.asc())

    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))


    result = query.offset((page - 1) * limit).limit(limit).all()
    if not result:
        raise HTTPException (status_code=404, detail="Search not found")

    return result



# --------------------------------------------------------------


@app.get("/jobs",response_model=JobPaginationResponse)

def job_filters(page:int = Query(1,ge=1),limit:int = Query(10,ge=1,le=50),sort_by:str = "newest",order:str|None = None,title:str|None=None,company:str|None=None,location:str|None=None,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    query = db.query(Job)
    if title:
        query = query.filter(Job.title.ilike(f"%{title}%") )
    if company:
        query = query.filter(Job.company.ilike(f"%{company}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))

    total = query.count()
    total_pages = (total + limit - 1) // limit

    columns = {
    "title": Job.title,
    "company": Job.company,
    "location": Job.location
}
    
    if sort_by == "newest":
        column = Job.id.desc()

    elif sort_by:
        column = columns.get(sort_by)

        if not column:
            raise HTTPException(status_code=400, detail="Invalid sort field")
        if order == "desc":
            column = column.desc()
        elif (order == "asc") or (order is None):
            column = column.asc()
    
        else:
            raise HTTPException(status_code=400, detail="Invalid Order")
    
    else:
        raise HTTPException(status_code=400, detail="Invalid sort")


    query = query.order_by(column)
    query = query.offset((page - 1) * limit).limit(limit)
    jobs = query.all()
    return {
    "total": total,
    "page": page,
    "limit": limit,
    "total_pages": total_pages,
    "jobs": jobs
}


# --------------------------------------------------------------


@app.post("/login",response_model=TokenResponse)
def login(email:str,password:str,db:Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
         raise HTTPException(status_code=401, detail="User not found")
    verify_pass = hash_password.verify(password,user.hashed_password)
    if not verify_pass:
         raise HTTPException(status_code=401, detail="Wrong password")
    token = Create_Token(user.id,user.email)
    return {
        "access_token":token,
        "token_type":"bearer"
    }



# --------------------------------------------------------------

@app.get("/me",response_model=UserResponse)
def me(token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException (status_code=404, detail="User not found")
    return user

# --------------------------------------------------------------

@app.put("/users/password")
def password_change(change_pass:Change_Password,token:str = Depends(Verify_Token),db:Session = Depends(get_db)):
    user_id = int(token["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException (status_code=404, detail="User not found")
    verify = hash_password.verify(change_pass.current_password,user.hashed_password)
    if not verify:
        raise HTTPException (status_code=400, detail="Wrong password")
    hashed_password = hash_password.hash(change_pass.new_password)
    user.hashed_password = hashed_password

    db.commit()

    return {
        "message":"Password updated successfully"
    }
from sqlalchemy import Column,Integer,String,ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer,primary_key=True)
    name = Column(String)
    email = Column(String,unique=True,nullable=False)
    hashed_password = Column(String)

    jobs = relationship("Job",back_populates="user")
    applications = relationship("Application",back_populates="user")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer,primary_key=True)
    title = Column(String)
    company = Column(String)
    description = Column(String)
    location = Column(String)
    user_id = Column(Integer,ForeignKey("users.id"))

    user = relationship("User",back_populates="jobs")

    applications = relationship("Application",back_populates="job")



class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer,primary_key=True)
    user_id = Column(Integer,ForeignKey("users.id"))
    job_id = Column(Integer,ForeignKey("jobs.id"))
    status = Column(String)


    user = relationship("User",back_populates="applications")
    job = relationship("Job",back_populates="applications")
 

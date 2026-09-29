import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
function Jobs() {
    const [jobtitle,setjobtitle] = useState("")
    const [location,setlocation] = useState("")
    const [Jobs,setJobs] = useState([])
    useEffect(()=>{

      async function getjobs() {
        const response = await fetch("https://ai-job-platform-gxljbtiv8-zaeem7.vercel.app/jobs")
        const data = await response.json()
        console.log(data)
        setJobs(data)
        
      }
      getjobs()


    },[])
  return (
    <div>
      <h1>Available Jobs</h1>
      <p>Find jobs that match your skills and interests.</p>

      <br />
      <div>
            <label>Jobtitle :</label>
            <input type="text" placeholder="Search by job title..."
            value={jobtitle}
            onChange={(e)=> setjobtitle(e.target.value)} />
            <br />

            <label>Location :</label>
            <input type="text" placeholder="Search by location..."
            value={location}
            onChange={(e)=> setlocation(e.target.value)} />

            <br />

            <button>Search</button>


      </div>

      <div>
        <h2>Job Title: Python Developer</h2>
        <p>Company: Tech Solutions</p>
        <p>Location: Remote</p>
        <p>Description: Looking for a Python developer to build and maintain backend applications.</p>
      <Link to={"/jobs/1"}><button>View Details</button></Link>
      </div>
      <div>
        <h2>Job Title: Frontend Developer</h2>
        <p>Company: WebTech</p>
        <p>Location: Remote</p>
        <p>Description: Looking for a frontend developer to create responsive and user-friendly web applications.</p>
      <Link to={"/jobs/2"}><button>View Details</button></Link>
  
      </div>
      <div>
        <h2>Job Title: Backend Developer</h2>
        <p>Company: DevWorks</p>
        <p>Location: Islamabad</p>
        <p>Description: Looking for a backend developer to build secure and scalable server-side applications</p>
      <Link to={"/jobs/3"}><button>View Details</button></Link>

      </div>

    </div>
  );
}

export default Jobs;

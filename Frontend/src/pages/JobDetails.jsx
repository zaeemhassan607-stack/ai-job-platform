import { useParams ,useNavigate } from "react-router-dom"

function JobDetails() {
    const {id} = useParams()
    const navigate = useNavigate()
    let title
    let company
    let location
    let description
    function ApplyNow(){
        navigate(`/applications/${id}`)
    }



    if (id === "1") {
        title = "Python developer"
        company = "Tech Solutions"
        location = "Remote"
        description = "Looking for a Python developer to build and maintain backend applications."
            }
    if (id === "2") {
        title = "Frontend developer"
        company = "WebTech"
        location = "Remote"
        description = "Looking for a frontend developer to create responsive and user-friendly web applications."
    }
    if (id === "3") {
        title = "Backend developer"
        company = "DevWorks"
        location = "Islamabad"
        description = "Looking for a backend developer to build secure and scalable server-side applications."

            }


  return (
    <div>
        <h1>
            Job Detials
        </h1>
        <p>Job ID : {id}</p>
        <h2>{title}</h2>
        <h3>{company}</h3>
        <h4>{location}</h4>
        <p>{description}</p>
        <button onClick={ApplyNow}>Apply Now</button>

        

        
      
    </div>
  )
}

export default JobDetails

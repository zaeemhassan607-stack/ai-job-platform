import { useParams } from "react-router-dom"
function MyApplications() {
    const {id} = useParams()

  return (
    <>
    <div>
        <h1>My Applications</h1>
        <p>You can track your application here</p>

      
    </div>
    <section>
        <h2>Your Applications</h2>
        <div>
            Application for JOB ID : {id}

        </div>
    </section>
    </>
  )
}

export default MyApplications

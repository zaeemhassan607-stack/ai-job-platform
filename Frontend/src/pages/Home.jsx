import { useState } from "react"
function Home() {
  const [title,settitle] = useState("")
  const [location,setlocation] = useState("")

  return (
    <div>

      <section>
        <h1>Find Your Dream Job</h1>
        <p>Find the right job opportunities and take the next step in your career with AI Job Platform.</p>
        <button >Browse Jobs</button>
        <button >Post a Job</button>
      </section>

      <section>

        <label>Title :</label>
        <input type="text" placeholder="Search job title..."
        value={title}
        onChange={(e)=> settitle(e.target.value)} />
        <br />

        <label>Location :</label>
        <input type="text" placeholder="Enter location..."
        value={location}
        onChange={(e)=> setlocation(e.target.value)} />

        <button >Search Jobs</button>

      </section>

      <section>

        <div>
          <h2>Find Jobs:</h2>
          <p>Find job opportunities that match your skills and interests.</p>
        </div>

        <div>
          <h2>Apply Easily:</h2>
          <p>Apply for jobs quickly and easily through our platform.</p>
        </div>

        <div>
          <h2>Track Applications:</h2>
          <p>Keep track of your job applications and their status.</p>
        </div>
      </section>


        <footer>
          <h3>AI Job Platform</h3>
          <p>© 2026 AI Job Platform. All rights reserved.</p>
        </footer>
        



      
    </div>
  )
}

export default Home

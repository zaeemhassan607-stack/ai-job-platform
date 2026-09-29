
import { Link } from "react-router-dom"
function Navbar() {
  return (
    <>
    <div >
        <div>Ai Job Platform</div>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/legister">Register</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/applications">Applications</Link>
            

        </nav>
    </div>
    </>
  )
}

export default Navbar

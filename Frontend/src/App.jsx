import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./components/Navbar"
import Jobs from "./pages/Jobs"
import JobDetails from "./pages/JobDetails"
import MyApplications from "./pages/MyApplications"
function App() {
  return (
    <div>
        <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/jobs" element={<Jobs/>}></Route>
            <Route path="/jobs/:id" element={<JobDetails/>}></Route>
            <Route path="/applications/:id" element={<MyApplications/>}></Route>

        </Routes>
        </BrowserRouter>
      
    </div>
  )
}

export default App

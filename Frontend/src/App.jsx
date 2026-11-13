import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobApplicants from "./pages/JobApplicants";
import CreateJob from "./pages/CreateJob";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeJobMatch from "./pages/ResumeJobMatch";
import JobRecommendations from "./pages/JobRecommendations";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Protected Routes */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-dashboard"
            element={
              <ProtectedRoute>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-dashboard/jobs/:jobId/applications"
            element={
              <ProtectedRoute>
                <JobApplicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-job"
            element={
              <ProtectedRoute>
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-analyzer"
            element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-job-match"
            element={
              <ProtectedRoute>
                <ResumeJobMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-recommendations"
            element={
              <ProtectedRoute>
                <JobRecommendations />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

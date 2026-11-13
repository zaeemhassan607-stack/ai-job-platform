
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    function logout() {
        localStorage.removeItem("token");
        alert("Logged out successfully!");
        navigate("/login");
    }

    // Active Link Styling
    const linkStyle = (path) => {

        const isActive = location.pathname === path;

        return `relative py-2 text-sm font-medium transition duration-200
        ${isActive ? "text-blue-400" : "text-gray-300 hover:text-blue-400"}
        after:absolute after:left-0 after:bottom-0 after:h-0.5
        after:bg-blue-400 after:transition-all after:duration-300
        ${isActive ? "after:w-full" : "after:w-0"}`;
    };

    return (

        <header className="bg-gray-900 text-white shadow-lg">

            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-5">

                {/* Logo */}

                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-400"
                >
                    AI Job Platform
                </Link>

                {/* Navigation */}

                <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">

                    <Link to="/" className={linkStyle("/")}>
                        Home
                    </Link>

                    {token ? (
                        <>

                            <Link
                                to="/jobs"
                                className={linkStyle("/jobs")}
                            >
                                Jobs
                            </Link>

                            <Link
                                to="/applications"
                                className={linkStyle("/applications")}
                            >
                                Applications
                            </Link>

                            <Link
                                to="/employer-dashboard"
                                className={linkStyle("/employer-dashboard")}
                            >
                                Employer Dashboard
                            </Link>

                            <Link
                                to="/create-job"
                                className={linkStyle("/create-job")}
                            >
                                Post a Job
                            </Link>

                            <Link
                                to="/profile"
                                className={linkStyle("/profile")}
                            >
                                Profile
                            </Link>

                            <Link
                                to="/resume-analyzer"
                                className={linkStyle("/resume-analyzer")}
                            >
                                AI Resume Analyzer
                            </Link>

                            <Link
                                to="/resume-job-match"
                                className={linkStyle("/resume-job-match")}
                            >
                                AI Resume Job Match
                            </Link>

                            <Link
                                to="/job-recommendations"
                                className={linkStyle("/job-recommendations")}
                            >
                                AI Job Recommendations
                            </Link>

                            {/* Logout Button */}

                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/40 px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                            >
                                <span className="text-base">↪</span>
                                Logout
                            </button>

                        </>
                    ) : (
                        <>

                            <Link
                                to="/login"
                                className={linkStyle("/login")}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className={linkStyle("/register")}
                            >
                                Register
                            </Link>

                            <Link
                                to="/jobs"
                                className={linkStyle("/jobs")}
                            >
                                Jobs
                            </Link>

                        </>
                    )}

                </nav>

            </div>

        </header>
    );
}

export default Navbar;

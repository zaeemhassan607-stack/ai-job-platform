
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {

    const [title, settitle] = useState("")
    const [location, setlocation] = useState("")

    const navigate = useNavigate()

    const browseJobs = () => {
        navigate("/jobs")
    }

    const postJob = () => {
        navigate("/login")
    }

    const searchJobs = () => {
        navigate(`/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`)
    }

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Hero Section */}
            <section className="bg-linear-to-r from-gray-900 to-blue-900 text-white px-6 py-24 text-center">

                <div className="max-w-4xl mx-auto">

                    <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm">
                        Your Career Starts Here
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-6 leading-tight">
                        Find Your <span className="text-blue-400">Dream Job</span>
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl mb-10">
                        Find the right job opportunities and take the next
                        step in your career with AI Job Platform.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">

                        <button
                            onClick={browseJobs}
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition"
                        >
                            Browse Jobs
                        </button>

                        <button
                            onClick={postJob}
                            className="border border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition"
                        >
                            Post a Job
                        </button>

                    </div>

                </div>

            </section>


            {/* Search Section */}
            <section className="max-w-5xl mx-auto px-6 -mt-10 relative">

                <div className="bg-white shadow-xl rounded-xl p-6 md:p-8">

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Search Your Next Job
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Job Title
                            </label>

                            <input
                                type="text"
                                placeholder="Search job title..."
                                value={title}
                                onChange={(e) => settitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Location
                            </label>

                            <input
                                type="text"
                                placeholder="Enter location..."
                                value={location}
                                onChange={(e) => setlocation(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-end">

                            <button
                                onClick={searchJobs}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                            >
                                Search Jobs
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-6 py-20">

                <div className="text-center mb-12">

                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Why Choose AI Job Platform?
                    </h2>

                    <p className="text-gray-600">
                        Everything you need to manage your job search.
                    </p>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center">

                        <div className="text-4xl mb-5">🔍</div>

                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Find Jobs
                        </h3>

                        <p className="text-gray-600 leading-relaxed">
                            Find job opportunities that match your skills and interests.
                        </p>

                    </div>


                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center">

                        <div className="text-4xl mb-5">📝</div>

                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Apply Easily
                        </h3>

                        <p className="text-gray-600 leading-relaxed">
                            Apply for jobs quickly and easily through our platform.
                        </p>

                    </div>


                    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition text-center">

                        <div className="text-4xl mb-5">📊</div>

                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Track Applications
                        </h3>

                        <p className="text-gray-600 leading-relaxed">
                            Keep track of your job applications and their status.
                        </p>

                    </div>

                </div>

            </section>


            {/* Footer */}
            <footer className="bg-gray-900 text-white text-center py-8 px-6">

                <h3 className="text-2xl font-bold text-blue-400 mb-3">
                    AI Job Platform
                </h3>

                <p className="text-gray-400">
                    © 2026 AI Job Platform. All rights reserved.
                </p>

            </footer>

        </div>
    )
}

export default Home

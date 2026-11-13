
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../api"

function EmployerDashboard() {

    const [jobs, setjobs] = useState([])
    const [loading, setloading] = useState(true)
    const [error, seterror] = useState("")

    const [editJob, seteditJob] = useState(null)
    const [title, settitle] = useState("")
    const [company, setcompany] = useState("")
    const [description, setdescription] = useState("")
    const [location, setlocation] = useState("")

    const navigate = useNavigate()

    useEffect(() => {

        async function getJobs() {

            try {
                const token = localStorage.getItem("token")

                const response = await fetch(
                    `${API_URL}/users/jobs`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    seterror(data.detail || "Unable to fetch jobs")
                    return
                }

                setjobs(data)

            } catch (error) {
                seterror("Cannot connect to server")
            } finally {
                setloading(false)
            }
        }

        getJobs()

    }, [])

    function startEdit(job) {
        seteditJob(job.id)
        settitle(job.title)
        setcompany(job.company)
        setdescription(job.description)
        setlocation(job.location)
    }

    async function updateJob() {

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                `${API_URL}/jobs/${editJob}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: title,
                        company: company,
                        description: description,
                        location: location
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.detail || "Unable to update job")
                return
            }

            setjobs((prev) =>
                prev.map((job) =>
                    job.id === editJob ? data : job
                )
            )

            seteditJob(null)
            alert("Job updated successfully!")

        } catch (error) {
            alert("Cannot connect to server")
        }
    }

    async function deleteJob(jobId) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        )

        if (!confirmDelete) {
            return
        }

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                `${API_URL}/jobs/${jobId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok) {
                alert(data.detail || "Unable to delete job")
                return
            }

            setjobs((prev) =>
                prev.filter((job) => job.id !== jobId)
            )

            alert("Job deleted successfully!")

        } catch (error) {
            alert("Cannot connect to server")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg font-semibold text-blue-600">
                    Loading jobs...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <p className="text-red-600 font-semibold">
                        {error}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-6xl mx-auto">

                {/* Page Heading */}

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Employer Dashboard
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your posted jobs and review applicants.
                    </p>
                </div>

                {/* Job Count */}

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">
                    <p className="text-gray-500 text-sm font-medium">
                        Total Posted Jobs
                    </p>

                    <h2 className="text-3xl font-bold text-blue-600 mt-1">
                        {jobs.length}
                    </h2>
                </div>

                {/* Jobs List */}

                {jobs.length === 0 ? (

                    <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">
                            No Jobs Posted Yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            You have not posted any jobs yet.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-6">

                        {jobs.map((job) => (

                            <div
                                key={job.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                            >

                                {/* Job Information */}

                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                                    <div className="flex-1">

                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                            Job ID: {job.id}
                                        </p>

                                        <h2 className="text-2xl font-bold text-gray-900 mt-2">
                                            {job.title}
                                        </h2>

                                        <p className="text-blue-600 font-semibold mt-2">
                                            {job.company}
                                        </p>

                                        <p className="text-gray-500 text-sm mt-2">
                                            Location: {job.location}
                                        </p>

                                        <p className="text-gray-600 mt-4 leading-relaxed">
                                            {job.description}
                                        </p>

                                    </div>

                                    {/* Action Buttons */}

                                    <div className="flex flex-wrap md:flex-col gap-3">

                                        <button
                                            onClick={() =>
                                                navigate(`/employer-dashboard/jobs/${job.id}/applications`)
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition cursor-pointer"
                                        >
                                            View Applicants
                                        </button>

                                        <button
                                            onClick={() => startEdit(job)}
                                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg font-medium transition cursor-pointer"
                                        >
                                            Edit Job
                                        </button>

                                        <button
                                            onClick={() => deleteJob(job.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition cursor-pointer"
                                        >
                                            Delete Job
                                        </button>

                                    </div>

                                </div>

                                {/* Edit Form */}

                                {editJob === job.id && (

                                    <div className="mt-7 border-t border-gray-100 pt-6">

                                        <h3 className="text-xl font-bold text-gray-900 mb-5">
                                            Edit Job Details
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Job Title
                                                </label>

                                                <input
                                                    value={title}
                                                    onChange={(e) => settitle(e.target.value)}
                                                    placeholder="Job Title"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Company
                                                </label>

                                                <input
                                                    value={company}
                                                    onChange={(e) => setcompany(e.target.value)}
                                                    placeholder="Company"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Location
                                                </label>

                                                <input
                                                    value={location}
                                                    onChange={(e) => setlocation(e.target.value)}
                                                    placeholder="Location"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Description
                                                </label>

                                                <textarea
                                                    value={description}
                                                    onChange={(e) => setdescription(e.target.value)}
                                                    placeholder="Description"
                                                    rows="4"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                                />
                                            </div>

                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-5">

                                            <button
                                                onClick={updateJob}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
                                            >
                                                Save Changes
                                            </button>

                                            <button
                                                onClick={() => seteditJob(null)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition cursor-pointer"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    )
}

export default EmployerDashboard

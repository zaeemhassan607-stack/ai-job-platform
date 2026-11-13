
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { API_URL } from "../api"

function JobDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [job, setjob] = useState({})
    const [hasApplied, sethasApplied] = useState(false)
    const [loading, setloading] = useState(true)
    const [error, seterror] = useState("")

    async function ApplyNow() {

        const token = localStorage.getItem("token")

        if (!token) {
            navigate("/login")
            return
        }

        try {
            const response = await fetch(`${API_URL}/applications`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    job_id: Number(id)
                })
            })

            const data = await response.json()

            // Debugging
            console.log("Application response status:", response.status)
            console.log("Application response data:", data)
            console.log("Job ID:", id)

            if (!response.ok) {
                alert(JSON.stringify(data.detail, null, 2))
                return
            }

            alert("Application successfully submitted!")
            navigate("/applications")

        } catch (error) {
            console.error("Application error:", error)
            alert("Cannot connect to the server")
        }
    }


    async function checkApplication() {

        const token = localStorage.getItem("token")

        if (!token) return

        try {
            const response = await fetch(`${API_URL}/users/applications`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) return

            const alreadyApplied = data.applications.some(
                (application) => application.job_id === Number(id)
            )

            sethasApplied(alreadyApplied)

        } catch (error) {
            console.error("Application check error:", error)
        }
    }


    useEffect(() => {

        async function getjob() {

            try {
                setloading(true)
                seterror("")

                const token = localStorage.getItem("token")

                const headers = {}

                if (token) {
                    headers.Authorization = `Bearer ${token}`
                }

                const response = await fetch(`${API_URL}/jobs/${id}`, {
                    headers
                })

                const data = await response.json()

                if (response.ok) {
                    setjob(data)
                } else {
                    seterror(data.detail || "Unable to fetch job details")
                }

            } catch (error) {
                console.error("Job error:", error)
                seterror("Cannot connect to server")
            } finally {
                setloading(false)
            }
        }

        getjob()
        checkApplication()

    }, [id])


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg font-semibold text-blue-600">
                    Loading job details...
                </p>
            </div>
        )
    }


    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <p className="text-red-600 font-semibold text-lg">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/jobs")}
                        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">

            <div className="max-w-4xl mx-auto">

                <button
                    onClick={() => navigate("/jobs")}
                    className="text-blue-600 hover:text-blue-800 font-medium mb-6 transition"
                >
                    ← Back to Jobs
                </button>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                    <div className="bg-linear-to-r from-gray-900 to-blue-900 px-6 py-8 md:px-10">

                        <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider">
                            Job Opportunity
                        </p>

                        <h1 className="text-2xl md:text-3xl font-bold text-white mt-3">
                            {job.title}
                        </h1>

                        <p className="text-blue-100 mt-3 text-lg">
                            {job.company}
                        </p>

                    </div>

                    <div className="p-6 md:p-10">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

                            <div className="bg-gray-50 p-5 rounded-xl">
                                <p className="text-sm text-gray-500 font-medium">
                                    Job ID
                                </p>

                                <p className="text-gray-900 font-semibold mt-2">
                                    {id}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-xl">
                                <p className="text-sm text-gray-500 font-medium">
                                    Location
                                </p>

                                <p className="text-gray-900 font-semibold mt-2">
                                    {job.location}
                                </p>
                            </div>

                        </div>

                        <div className="mb-8">

                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Job Description
                            </h2>

                            <p className="text-gray-600 leading-7 whitespace-pre-line">
                                {job.description}
                            </p>

                        </div>

                        <div className="border-t border-gray-100 pt-6">

                            <button
                                onClick={ApplyNow}
                                disabled={hasApplied}
                                className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-white transition duration-200 ${
                                    hasApplied
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md"
                                }`}
                            >
                                {hasApplied ? "Already Applied" : "Apply Now"}
                            </button>

                            {hasApplied && (
                                <p className="text-green-600 text-sm mt-3">
                                    You have already submitted an application for this job.
                                </p>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default JobDetails

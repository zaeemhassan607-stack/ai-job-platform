
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

function JobApplicants() {

    const { jobId } = useParams();
    const navigate = useNavigate();

    const [applications, setapplications] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");

    useEffect(() => {

        async function getApplicants() {

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/jobs/${jobId}/applications?sort=newest&page=1&limit=10`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    seterror(data.detail || "Unable to fetch applicants");
                    return;
                }

                setapplications(data.applications);

            } catch (error) {
                seterror("Cannot connect to server");
            } finally {
                setloading(false);
            }
        }

        getApplicants();

    }, [jobId]);

    async function updateStatus(applicationId, status) {

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/applications/${applicationId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: status,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Unable to update status");
                return;
            }

            setapplications((prev) =>
                prev.map((application) =>
                    application.id === applicationId
                        ? { ...application, status: data.status }
                        : application,
                ),
            );

            alert(`Application ${status} successfully!`);

        } catch (error) {
            alert("Cannot connect to server");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg font-semibold text-blue-600">
                    Loading applicants...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <p className="text-red-600 font-semibold text-lg">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    function statusStyle(status) {

        if (status === "accepted") {
            return "bg-green-100 text-green-700";
        }

        if (status === "rejected") {
            return "bg-red-100 text-red-700";
        }

        if (status === "withdrawn") {
            return "bg-gray-200 text-gray-700";
        }

        return "bg-yellow-100 text-yellow-700";
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-6xl mx-auto">

                {/* Page Heading */}

                <div className="mb-8">

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Job Applicants
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Review applications and manage applicant status.
                    </p>

                </div>

                {/* Dashboard Button */}

                <button
                    onClick={() => navigate("/employer-dashboard")}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium transition cursor-pointer mb-8"
                >
                    ← Back to Dashboard
                </button>

                {/* Applicants Count */}

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-8">

                    <p className="text-gray-500 text-sm font-medium">
                        Total Applicants
                    </p>

                    <h2 className="text-3xl font-bold text-blue-600 mt-1">
                        {applications.length}
                    </h2>

                    <p className="text-sm text-gray-400 mt-1">
                        Job ID: {jobId}
                    </p>

                </div>

                {/* Applicants List */}

                {applications.length === 0 ? (

                    <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">

                        <h2 className="text-xl font-semibold text-gray-800">
                            No Applicants Yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            No applicants have applied for this job yet.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {applications.map((application) => (

                            <div
                                key={application.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition duration-200"
                            >

                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">

                                    {/* Applicant Information */}

                                    <div className="flex-1">

                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                            Application ID: {application.id}
                                        </p>

                                        <h3 className="text-xl font-bold text-gray-900 mt-3">
                                            Applicant #{application.user_id}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-2">
                                            User ID: {application.user_id}
                                        </p>

                                        <div className="mt-4">

                                            <span className="text-sm text-gray-500 mr-2">
                                                Status:
                                            </span>

                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusStyle(application.status)}`}
                                            >
                                                {application.status}
                                            </span>

                                        </div>

                                    </div>

                                    {/* Action Buttons */}

                                    {application.status === "pending" && (

                                        <div className="flex flex-wrap gap-3 sm:self-center">

                                            <button
                                                onClick={() => updateStatus(application.id, "accepted")}
                                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition cursor-pointer"
                                            >
                                                Accept
                                            </button>

                                            <button
                                                onClick={() => updateStatus(application.id, "rejected")}
                                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition cursor-pointer"
                                            >
                                                Reject
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default JobApplicants;


import { useState, useEffect } from "react";
import { API_URL } from "../api";

function MyApplications() {

    const [applications, setapplications] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");

    function getErrorMessage(detail, fallback) {

        if (typeof detail === "string") {
            return detail;
        }

        if (Array.isArray(detail)) {
            return detail.map((item) => item.msg || JSON.stringify(item)).join(", ");
        }

        if (detail && typeof detail === "object") {
            return JSON.stringify(detail);
        }

        return fallback;
    }

    // Get Applications
    useEffect(() => {

        async function getjob() {

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/users/applications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        getErrorMessage(data.detail, "Failed to load applications")
                    );
                }

                setapplications(data.applications || []);

            } catch (error) {
                console.error("Applications error:", error);
                seterror(error.message);
            } finally {
                setloading(false);
            }
        }

        getjob();

    }, []);

    // Withdraw Application
    async function withdrawApplication(id) {

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/applications/${id}/withdraw`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(getErrorMessage(data.detail, "Unable to withdraw application"));
                return;
            }

            setapplications((prev) =>
                prev.map((application) =>
                    application.id === id
                        ? { ...application, status: "withdrawn" }
                        : application
                )
            );

            alert("Application withdrawn successfully!");

        } catch (error) {
            console.error(error);
            alert("Cannot connect to server");
        }
    }

    // Delete Application
    async function deleteApplication(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to permanently delete this application?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/applications/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                alert(getErrorMessage(data.detail, "Unable to delete application"));
                return;
            }

            setapplications((prev) =>
                prev.filter((application) => application.id !== id)
            );

            alert("Application deleted successfully!");

        } catch (error) {
            console.error(error);
            alert("Cannot connect to server");
        }
    }

    // Status Colors
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

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        My Applications
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Track your job applications and their current status.
                    </p>
                </div>

                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

                        <h2 className="text-xl font-bold text-gray-900">
                            Your Applications
                        </h2>

                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                            Total: {applications.length}
                        </span>

                    </div>

                    {loading ? (

                        <div className="text-center py-12">
                            <p className="text-blue-600 font-semibold">
                                Loading applications...
                            </p>
                        </div>

                    ) : error ? (

                        <div className="bg-red-50 text-red-600 p-5 rounded-lg text-center">
                            {error}
                        </div>

                    ) : applications.length === 0 ? (

                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <h3 className="text-xl font-semibold text-gray-800">
                                No Applications Yet
                            </h3>

                            <p className="text-gray-500 mt-2">
                                You haven't applied for any jobs yet.
                            </p>
                        </div>

                    ) : (

                        <div className="space-y-5">

                            {applications.map((application) => (

                                <div
                                    key={application.id}
                                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition duration-200"
                                >

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

                                        <div className="flex-1">

                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                                Application ID: {application.id}
                                            </p>

                                            <h3 className="text-xl font-bold text-gray-900 mt-2">
                                                {application.job?.title || "Job unavailable"}
                                            </h3>

                                            <p className="text-blue-600 font-semibold mt-2">
                                                {application.job?.company || "N/A"}
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

                                        <div className="flex flex-col gap-3 sm:self-center">

                                            <button
                                                onClick={() => withdrawApplication(application.id)}
                                                disabled={application.status === "withdrawn"}
                                                className={`px-5 py-2.5 rounded-lg font-medium transition duration-200 ${
                                                    application.status === "withdrawn"
                                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                        : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                                }`}
                                            >
                                                {application.status === "withdrawn"
                                                    ? "Withdrawn"
                                                    : "Withdraw Application"}
                                            </button>

                                            <button
                                                onClick={() => deleteApplication(application.id)}
                                                className="px-5 py-2.5 rounded-lg font-medium bg-gray-800 hover:bg-black text-white transition duration-200 cursor-pointer"
                                            >
                                                Delete Application
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default MyApplications;

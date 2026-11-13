
import { useState } from "react";
import { API_URL } from "../api";

function CreateJob() {

    const [title, settitle] = useState("");
    const [company, setcompany] = useState("");
    const [description, setdescription] = useState("");
    const [location, setlocation] = useState("");

    async function createJob() {

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/jobs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    company,
                    description,
                    location,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.detail || "Unable to create job");
                return;
            }

            alert("Job posted successfully!");

            settitle("");
            setcompany("");
            setdescription("");
            setlocation("");

        } catch (error) {
            alert("Cannot connect to server");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-12">

            <div className="max-w-3xl mx-auto">

                {/* Page Heading */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Post a New Job
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Share a job opportunity and find the right candidates.
                    </p>

                </div>

                {/* Job Form */}

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">

                    <div className="space-y-5">

                        {/* Job Title */}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) => settitle(e.target.value)}
                                placeholder="e.g. React Developer"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Company */}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Name
                            </label>

                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setcompany(e.target.value)}
                                placeholder="Enter company name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Location */}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Location
                            </label>

                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setlocation(e.target.value)}
                                placeholder="e.g. Lahore, Pakistan"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Description */}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                placeholder="Describe the job role, required skills and responsibilities..."
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                            />
                        </div>

                        {/* Submit Button */}

                        <button
                            onClick={createJob}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md cursor-pointer"
                        >
                            Post Job
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CreateJob;

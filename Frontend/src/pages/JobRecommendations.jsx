
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

function JobRecommendations() {

    const [file, setfile] = useState(null);
    const [recommendations, setrecommendations] = useState([]);
    const [jobs, setjobs] = useState([]);
    const [loading, setloading] = useState(false);
    const [fetching, setfetching] = useState(true);
    const [error, seterror] = useState("");
    const [searched, setsearched] = useState(false);

    // Get Available Jobs
    useEffect(() => {

        async function getjobs() {

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/jobs`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Unable to load jobs.");
                }

                setjobs(data.jobs || data);

            } catch (err) {
                seterror(err.message);

            } finally {
                setfetching(false);
            }
        }

        getjobs();

    }, []);

    // Get AI Job Recommendations
    async function handleRecommend() {

        if (!file) {
            seterror("Please upload your resume.");
            return;
        }

        if (!file.name.toLowerCase().endsWith(".pdf")) {
            seterror("Only PDF files are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            seterror("File size must be less than 5 MB.");
            return;
        }

        setloading(true);
        seterror("");
        setrecommendations([]);
        setsearched(false);

        try {

            const token = localStorage.getItem("token");

            const formdata = new FormData();
            formdata.append("file", file);

            const response = await fetch(
                `${API_URL}/ai/recommend-jobs`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formdata
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Job recommendations failed."
                );
            }

            const recommendedJobs = (data.recommendations || []).map((item) => {

                const job = jobs.find(
                    (job) => job.id === item.job_id
                );

                return {
                    ...item,
                    job
                };

            }).filter((item) => item.job);

            setrecommendations(recommendedJobs);
            setsearched(true);

        } catch (err) {
            seterror(err.message);

        } finally {
            setloading(false);
        }
    }

    return (

        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold text-center text-gray-800">
                    AI Job Recommendations
                </h1>

                <p className="text-center text-gray-500 mt-3">
                    Find the best jobs according to your resume.
                </p>

                {/* Resume Upload */}

                <div className="bg-white shadow-md rounded-xl p-6 mt-8">

                    <label className="block font-semibold text-gray-700 mb-3">
                        Upload Your Resume (PDF)
                    </label>

                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition p-6">

                        <div className="text-5xl text-blue-600 mb-3">
                            ☁
                        </div>

                        <p className="text-lg font-semibold text-gray-700">
                            Click to upload your resume
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            PDF files only (Maximum 5 MB)
                        </p>

                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                                setfile(e.target.files[0] || null);
                                setrecommendations([]);
                                setsearched(false);
                                seterror("");
                            }}
                        />

                    </label>

                    {file && (

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">

                            <p className="text-sm font-semibold text-gray-700">
                                📄 {file.name}
                            </p>

                            <p className="text-xs text-green-600 mt-1">
                                File selected successfully
                            </p>

                        </div>

                    )}

                    <button
                        onClick={handleRecommend}
                        disabled={loading || fetching || jobs.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-5 disabled:opacity-50 transition"
                    >
                        {loading
                            ? "Finding Best Jobs..."
                            : "Get Job Recommendations"}
                    </button>

                    {fetching && (
                        <p className="text-sm text-gray-500 mt-3 text-center">
                            Loading available jobs...
                        </p>
                    )}

                    {error && (
                        <p className="text-red-600 bg-red-50 p-3 rounded-lg mt-4">
                            {error}
                        </p>
                    )}

                </div>

                {/* Recommendations */}

                {recommendations.length > 0 && (

                    <div className="mt-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">
                            Recommended Jobs
                        </h2>

                        <div className="space-y-5">

                            {recommendations.map((item) => (

                                <div
                                    key={item.job_id}
                                    className="bg-white shadow-md rounded-xl p-6"
                                >

                                    <div className="flex justify-between items-start gap-4">

                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {item.job.title}
                                            </h3>

                                            <p className="text-gray-600 mt-1">
                                                {item.job.company}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.job.location}
                                            </p>
                                        </div>

                                        <span className="text-xl font-bold text-blue-600 whitespace-nowrap">
                                            {item.matching_percentage}%
                                        </span>

                                    </div>

                                    {/* Match Progress */}

                                    <div className="w-full bg-gray-200 rounded-full h-3 mt-5">

                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-700"
                                            style={{
                                                width: `${Math.min(100, Math.max(0, Number(item.matching_percentage) || 0))}%`
                                            }}
                                        ></div>

                                    </div>

                                    {/* Recommendation Reason */}

                                    <div className="bg-blue-50 rounded-lg p-4 mt-5">

                                        <h4 className="font-semibold text-gray-800 mb-2">
                                            Why this job matches you
                                        </h4>

                                        <p className="text-sm text-gray-700 leading-6">
                                            {item.reason}
                                        </p>

                                    </div>

                                    <Link
                                        to={`/jobs/${item.job_id}`}
                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg mt-5 transition"
                                    >
                                        View Job
                                    </Link>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

                {/* Empty State */}

                {searched && recommendations.length === 0 && !loading && !error && (

                    <div className="bg-white shadow-md rounded-xl p-8 mt-8 text-center">

                        <div className="text-5xl mb-4">
                            🔍
                        </div>

                        <h2 className="text-xl font-bold text-gray-800">
                            No Suitable Jobs Found
                        </h2>

                        <p className="text-gray-500 mt-3 leading-6">
                            We couldn't find jobs matching your resume.
                            Try updating your resume with relevant skills
                            and experience.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );
}

export default JobRecommendations;

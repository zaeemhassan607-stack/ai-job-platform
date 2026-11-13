
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL } from "../api";

function Jobs() {

    const [jobs, setjobs] = useState([]);
    const [page, setpage] = useState(1);
    const [totalPages, settotalPages] = useState(0);
    const [sortBy, setsortBy] = useState("newest");
    const [order, setorder] = useState("asc");
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");

    const [searchParams] = useSearchParams();

    const title = searchParams.get("title") || "";
    const location = searchParams.get("location") || "";

    useEffect(() => {

        async function getjobs() {
            try {
                setloading(true);
                seterror("");

                const token = localStorage.getItem("token");
                const headers = {};

                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(
                    `${API_URL}/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}&page=${page}&limit=10&sort_by=${sortBy}&order=${order}`,
                    { headers }
                );

                const data = await response.json();

                if (!response.ok) {
                    seterror(data.detail || "Unable to fetch jobs");
                    return;
                }

                setjobs(data.jobs);
                settotalPages(data.total_pages);

            } catch (error) {
                seterror("Cannot connect to server");
            } finally {
                setloading(false);
            }
        }

        getjobs();

    }, [title, location, page, sortBy, order]);

    function changeSort(value) {
        setsortBy(value);
        setpage(1);
    }

    function changeOrder(value) {
        setorder(value);
        setpage(1);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg font-semibold text-blue-600">
                    Loading jobs...
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

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="max-w-6xl mx-auto">

                {/* Page Heading */}

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Available Jobs
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Find jobs that match your skills and interests.
                    </p>
                </div>

                {/* Sorting Section */}

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">

                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Sort Jobs
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-5">

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>

                            <select
                                value={sortBy}
                                onChange={(e) => changeSort(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="newest">Newest</option>
                                <option value="title">Job Title</option>
                                <option value="company">Company</option>
                                <option value="location">Location</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order
                            </label>

                            <select
                                value={order}
                                onChange={(e) => changeOrder(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* Jobs List */}

                <div className="space-y-5">

                    {jobs.length === 0 ? (

                        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800">
                                No Jobs Found
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Try changing your search keywords or location.
                            </p>
                        </div>

                    ) : (

                        jobs.map((job) => (

                            <div
                                key={job.id}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200"
                            >

                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                                    <div className="flex-1">

                                        <h3 className="text-xl font-bold text-gray-900">
                                            {job.title}
                                        </h3>

                                        <p className="text-blue-600 font-semibold mt-2">
                                            {job.company}
                                        </p>

                                        <p className="text-gray-500 text-sm mt-2">
                                            <span className="font-medium text-gray-700">
                                                Location:
                                            </span>{" "}
                                            {job.location}
                                        </p>

                                        <p className="text-gray-600 mt-4 leading-relaxed">
                                            {job.description}
                                        </p>

                                    </div>

                                    <div className="md:self-center">

                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition duration-200"
                                        >
                                            View Details
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>

                {/* Pagination */}

                <div className="flex flex-wrap justify-center items-center gap-4 mt-10">

                    <button
                        onClick={() => setpage(page - 1)}
                        disabled={page === 1}
                        className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Previous
                    </button>

                    <span className="text-gray-700 font-semibold">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() => setpage(page + 1)}
                        disabled={page >= totalPages}
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Jobs;

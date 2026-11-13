
import { useState } from "react";
import { API_URL } from "../api";

function ResumeAnalyzer() {

    const [file, setfile] = useState(null);
    const [analysis, setanalysis] = useState("");
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState("");

    async function handleAnalyze() {

        if (!file) {
            seterror("Please select a PDF resume first.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            seterror("File size must be less than 5 MB.");
            return;
        }

        setloading(true);
        seterror("");
        setanalysis("");

        try {
            const token = localStorage.getItem("token");

            const formdata = new FormData();
            formdata.append("file", file);

            const response = await fetch(`${API_URL}/ai/analyze-resume`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formdata
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Resume analysis failed.");
            }

            setanalysis(data.analysis);

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
                    AI Resume Analyzer
                </h1>

                <p className="text-center text-gray-500 mt-3">
                    Upload your resume and get AI-powered feedback.
                </p>

                <div className="bg-white shadow-md rounded-xl p-6 mt-8">

                    <label className="block font-semibold text-gray-700 mb-3">
                        Upload Your Resume (PDF)
                    </label>

                    {/* Upload Box */}
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
                                seterror("");
                                setanalysis("");
                            }}
                        />

                    </label>

                    {/* Selected File */}
                    {file && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3 mt-4">

                            <span className="text-2xl">📄</span>

                            <div>
                                <p className="text-sm font-semibold text-gray-700">
                                    {file.name}
                                </p>

                                <p className="text-xs text-green-600">
                                    File selected successfully
                                </p>
                            </div>

                        </div>
                    )}

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-5 disabled:opacity-50 transition"
                    >
                        {loading ? "Analyzing Resume..." : "Analyze Resume"}
                    </button>

                    {/* Error */}
                    {error && (
                        <p className="text-red-600 bg-red-50 p-3 rounded-lg mt-4">
                            {error}
                        </p>
                    )}

                </div>

                {/* Analysis Result */}
                {analysis && (
                    <div className="bg-white shadow-md rounded-xl p-6 mt-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-5">
                            Resume Analysis Result
                        </h2>

                        <div className="text-gray-700 whitespace-pre-wrap leading-7">
                            {analysis}
                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default ResumeAnalyzer;

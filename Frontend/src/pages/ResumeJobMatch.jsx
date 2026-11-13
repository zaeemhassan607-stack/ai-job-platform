import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_URL } from "../api";

function ResumeJobMatch() {
  const [jobs, setjobs] = useState([]);
  const [jobid, setjobid] = useState("");
  const [file, setfile] = useState(null);
  const [result, setresult] = useState(null);
  const [loading, setloading] = useState(false);
  const [fetching, setfetching] = useState(true);
  const [error, seterror] = useState("");

  // Get Available Jobs
  useEffect(() => {
    async function getjobs() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Match Resume With Job
  async function handleMatch() {
    if (!jobid) {
      seterror("Please select a job.");
      return;
    }

    if (!file) {
      seterror("Please upload your resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      seterror("File size must be less than 5 MB.");
      return;
    }

    setloading(true);
    seterror("");
    setresult(null);

    try {
      const token = localStorage.getItem("token");

      const formdata = new FormData();
      formdata.append("file", file);

      const response = await fetch(`${API_URL}/ai/match-resume/${jobid}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Resume matching failed.");
      }

      setresult(data);
    } catch (err) {
      seterror(err.message);
    } finally {
      setloading(false);
    }
  }
  const matchingScore = Number(
    result?.analysis.match(
      /Matching Percentage[\s\S]{0,100}?(\d{1,3})\s*%/i,
    )?.[1] || 0,
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          AI Resume Job Matching
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Find out how well your resume matches a job.
        </p>

        <div className="bg-white shadow-md rounded-xl p-6 mt-8">
          {/* Job Selection */}
          <label className="block font-semibold text-gray-700 mb-3">
            Select a Job
          </label>

          <select
            value={jobid}
            onChange={(e) => {
              setjobid(e.target.value);
              setresult(null);
              seterror("");
            }}
            className="w-full border border-gray-300 rounded-lg p-3 mb-6"
            disabled={fetching}
          >
            <option value="">
              {fetching ? "Loading jobs..." : "Choose a job"}
            </option>

            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>

          {!fetching && jobs.length === 0 && (
            <p className="text-sm text-gray-500 mb-5">No jobs available.</p>
          )}

          {/* Resume Upload */}
          <label className="block font-semibold text-gray-700 mb-3">
            Upload Your Resume (PDF)
          </label>

          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition p-6">
            <div className="text-5xl text-blue-600 mb-3">☁</div>

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
                setresult(null);
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

          {/* Match Button */}
          <button
            onClick={handleMatch}
            disabled={loading || fetching || jobs.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-5 disabled:opacity-50 transition"
          >
            {loading ? "Matching Resume..." : "Match My Resume"}
          </button>

          {/* Error */}
          {error && (
            <p className="text-red-600 bg-red-50 p-3 rounded-lg mt-4">
              {error}
            </p>
          )}
        </div>

        {/* Matching Result */}
        {result && (
          <div className="bg-white shadow-md rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Matching Result
            </h2>

            {/* Matching Percentage */}
            <div className="bg-blue-50 rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">Resume Match Score</h3>

                <span className="text-2xl font-bold text-blue-600">
                  {matchingScore}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-700"
                  style={{ width: `${matchingScore}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600 mt-3">
                Your resume matches {matchingScore}% with this job.
              </p>
            </div>

            {/* Job Information */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Selected Job</p>

              <h3 className="text-lg font-bold text-gray-800">
                {result.job_title}
              </h3>

              <p className="text-gray-600">{result.company}</p>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              AI Analysis
            </h3>

            {/* Formatted Markdown */}
            <div
              className="
                            text-gray-700 leading-7
                            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3
                            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
                            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
                            [&_p]:mb-3
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                            [&_li]:mb-2
                            [&_table]:w-full [&_table]:border-collapse [&_table]:my-5
                            [&_th]:bg-gray-100 [&_th]:font-semibold
                            [&_th]:border [&_th]:border-gray-300 [&_th]:p-3
                            [&_td]:border [&_td]:border-gray-300 [&_td]:p-3
                            [&_strong]:font-bold [&_strong]:text-gray-900
                        "
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result.analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeJobMatch;

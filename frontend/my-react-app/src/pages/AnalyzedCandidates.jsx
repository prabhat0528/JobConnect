import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AnalyzeCandidates() {
  const { jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [analyzedData, setAnalyzedData] = useState([]);
  const [error, setError] = useState("");

  const [emailSending, setEmailSending] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState("");

  useEffect(() => {
    const analyze = async () => {
      try {
        const { data: job } = await axios.get(
          `https://jobconnect-backend.onrender.com/api/jobPosting/${jobId}`,{ withCredentials: true }
        );
        const jobDesc = job.description;
        const applicants = job.applicants;

        const results = await Promise.all(
          applicants.map(async (applicant, i) => {
            const resumeUrl = applicant.resumeUrl;

            try {
              if (!resumeUrl) {
                return {
                  Name: applicant.name || "Candidate",
                  Email: "N/A",
                  matching_percent: 0,
                  emailStatus: "skipped",
                };
              }

              const response = await fetch(resumeUrl, { mode: "cors" });
              if (!response.ok) throw new Error("Failed to fetch resume");

              const blob = await response.blob();
              if (blob.size === 0) throw new Error("Empty resume file");

              const file = new File([blob], `resume${i + 1}.pdf`, {
                type: blob.type,
              });

              const formData = new FormData();
              formData.append("resume", file);
              formData.append("job_description", jobDesc);

              const { data } = await axios.post(
                "https://jobconnect-python.onrender.com/analyze",
                formData,
                {
                  withCredentials: true,
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );

              const score = data.matching_percent || 0;

              return {
                ...data,
                resumeLink: resumeUrl,
                score,
              };
            } catch (err) {
              console.error("Resume analysis failed:", err.message);
              return {
                Name: applicant.name || "Candidate",
                Email: "N/A",
                matching_percent: 0,
                resumeLink: resumeUrl,
                error: true,
                emailStatus: "fail",
              };
            }
          })
        );

        setAnalyzedData(results);
      } catch (err) {
        console.error("Job fetch or analysis error:", err.message);
        setError("Failed to analyze candidates.");
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, [jobId]);

  const handleSendEmails = async () => {
    setEmailSending(true);
    setEmailStatusMessage("");

   try {
  const response = await axios.post(
    "https://jobconnect-backend.onrender.com/api/jobPosting/sendBulkEmails",
    {
      candidates: analyzedData.map((candidate) => ({
        name: candidate.Name,
        email: candidate.Email,
        score: candidate.matching_percent || candidate.score || 0,
      })),
    },
    {
      withCredentials: true, 
    }
  );

  setEmailStatusMessage(response.data.message || "Emails sent.");
} catch (err) {
      console.error("Error sending emails:", err.message);
      setEmailStatusMessage("❌ Failed to send emails.");
    }

    setEmailSending(false);
  };

  if (loading)
    return <p className="p-4 text-blue-500">Analyzing candidates...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Analyzed Candidates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyzedData.map((candidate, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-indigo-700">
              {candidate.Name || "N/A"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Email:</strong> {candidate.Email || "N/A"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Matching %:</strong> {candidate.matching_percent || candidate.score || 0}%
            </p>
            {candidate.resumeLink && (
              <a
                href={candidate.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-blue-600 hover:underline text-sm"
              >
                View Resume
              </a>
            )}
            {candidate.error && (
              <p className="text-sm text-red-500 mt-2">Resume processing failed.</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSendEmails}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          disabled={emailSending}
        >
          {emailSending ? "Sending Emails..." : "Send Emails"}
        </button>
        {emailStatusMessage && (
          <p className="text-green-600 mt-3 font-medium">{emailStatusMessage}</p>
        )}
      </div>
    </div>
  );
}

export default AnalyzeCandidates;

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyPostedJobs() {
  const { userData } = useContext(AuthContext);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await axios.get(
          `https://jobconnect-backend.onrender.com/api/user/${userData._id}`
        );
        setPostedJobs(response.data);
      } catch (err) {
        setError("Failed to load posted jobs.");
      } finally {
        setLoading(false);
      }
    };

    if (userData && userData._id) {
      fetchPostedJobs();
    }
  }, [userData]);

  // ✅ Handle job deletion
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://jobconnect-backend.onrender.com/api/jobPosting/${jobId}`);
      setPostedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (err) {
      alert("Failed to delete the job. Please try again.");
    }
  };

  if (loading) return <p className="p-4 text-blue-500">Loading posted jobs...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">My Posted Jobs</h2>
      {postedJobs.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't posted any jobs yet.</p>
      ) : (
        <ul className="space-y-6">
          {postedJobs.map((job) => (
            <li
              key={job._id}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition relative pb-20"
            >
              <h3 className="text-xl font-semibold text-indigo-700">{job.title}</h3>
              <p className="mt-2 text-gray-700">{job.description}</p>
              <b>Required Skills: </b>
              <p className="mt-2 text-gray-700">{job.requiredSkills}</p>
              <p className="mt-2 text-sm text-gray-500">
                Location: {job.location} | Salary: ₹{job.salary}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </p>

              {/*  View Candidates Button */}
              <button
                onClick={() => navigate(`/analyze/${job._id}`)}
                className="absolute bottom-4 right-36 bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700 transition"
              >
                View Analyzed Candidates
              </button>

              {/* ✅ Delete Button */}
              <button
                onClick={() => handleDelete(job._id)}
                className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 text-sm rounded hover:bg-red-700 transition"
              >
                Delete Job
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyPostedJobs;

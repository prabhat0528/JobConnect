import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authcontext";
import axios from "axios";

function MyPostedJobs() {
  const { userData } = useContext(AuthContext);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/${userData._id}`
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
            <li key={job._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-700">{job.title}</h3>
              <p className="mt-2 text-gray-700">{job.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Location: {job.location} | Salary: ₹{job.salary}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyPostedJobs;

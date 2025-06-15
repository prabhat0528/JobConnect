// SearchJob.jsx
import React, { useState } from 'react';
import axios from 'axios';


const client = axios.create({
    baseURL: "http://localhost:8080/api/jobPosting",
    withCredentials: true,
});



function SearchJob() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');

  const handleSearch = async () => {
    try {
      const res = await client.get('/search', {
        params: { title, location, skills }
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Search Jobs</h2>
      <div className="flex gap-4 flex-wrap mb-6">
        <input
          type="text"
          placeholder="Job title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Skills"
          className="border p-2 rounded"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-700">{job.company} - {job.location}</p>
            <p className="text-sm mt-2">{job.description}</p>
            <p className="text-sm mt-2 text-blue-600">Skills: {job.requiredSkills}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchJob;

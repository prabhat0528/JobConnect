// SearchJob.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa'; 

const client = axios.create({
    baseURL: "https://jobconnect-backend.onrender.com/api/jobPosting",
    withCredentials: true,
});

function SearchJob() {
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState('');
    const [workMode, setWorkMode] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [hasSearched, setHasSearched] = useState(false); 

    const handleSearch = async () => {
        setIsLoading(true); 
        setHasSearched(true); 
        setJobs([]); 

        try {
           
            const res = await client.get('/search', {
                params: { title, workType: workMode }
            });
            setJobs(res.data);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            
        } finally {
            setIsLoading(false); 
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
                <select
                    className="border p-2 rounded"
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)} 
                >
                    <option value="">Select Work Mode</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                </select>

                <button
                    onClick={handleSearch}
                    disabled={isLoading} 
                    className={`text-white px-4 py-2 rounded transition duration-300 ${
                        isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <FaSpinner className="animate-spin mr-2" /> Searching...
                        </span>
                    ) : (
                        'Search'
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* 1. Show Spinner while loading */}
                {isLoading && (
                    <div className="text-center p-8">
                        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" />
                        <p className="mt-4 text-gray-600">Searching for jobs...</p>
                    </div>
                )}

                {/* 2. Show No Jobs Found message */}
                {!isLoading && hasSearched && jobs.length === 0 && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                        <p className="font-bold">No Jobs Found 😔</p>
                        <p>No jobs found for the specified title and work mode. Please try again with different keywords or check back in a few days.</p>
                    </div>
                )}

                {/* Display Jobs */}
                {!isLoading && jobs.map((job) => (
                    <div key={job._id} className="bg-white p-4 rounded shadow">
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <p className="text-gray-700">{job.company} - {job.location}</p>
                        <p className="text-sm mt-2">{job.description}</p>
                        <p className="text-sm mt-2 text-blue-600">Required Skills: <b>{job.requiredSkills}</b></p>
                        <p className="text-sm mt-2 text-blue-600">Stipend: &nbsp; <b>{job.salary}</b></p>
                        <Link to={`/apply/${job._id}`}>
                            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
                                Apply
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchJob;
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
  });

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setForm({ ...form, resume: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("resume", form.resume);

    try {
      await axios.post(`https://jobconnect-backend.onrender.com/api/jobPosting/apply/${jobId}`, { withCredentials: true },formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Application submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Apply error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Your Email" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full border p-2 rounded" />
        <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} required className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default ApplyJob;

import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';



const client = axios.create({
    baseURL: "https://jobconnect-backend.onrender.com/api/jobPosting",
    withCredentials: true,
});


export default function Jobposting() {8
  const navigate = useNavigate();
  const[form,setForm] =useState({
    title: "",
    company: "",
    description: "",
    workType: "",
    requiredSkills:"",
    location: "",
    salary: "",

  });

  const [loading, setLoading] = useState(false);
  const [msg,setMsg] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try{

        const res = await client.post("/post-job",form);
        setForm({
            title: "",
            company: "",
            description: "",
            workType: "",
            requiredSkills:"",
            location: "",
            salary: "",
        })

         navigate("/");

    }catch(err){
        setMsg("❌ " + (err.response?.data?.message || "Error posting job"));
    } finally {
      setLoading(false);
    
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Post a Job</h2>

        {msg && (
          <div
            className={`mb-4 px-4 py-2 rounded-md text-sm font-medium ${
              msg.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="workType"
            placeholder="Work Type (e.g. Remote, Onsite)"
            value={form.workType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="requiredSkills"
            placeholder="Provide required skills separated by commas',' "
            value={form.requiredSkills}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary (e.g. ₹10L – ₹15L)"
            value={form.salary}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  )
}

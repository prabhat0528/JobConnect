import React, { useState } from 'react';
import axios from 'axios';

function ResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      alert('Please provide job description and upload resume');
      return;
    }

    const formData = new FormData();
    formData.append('job_description', jobDescription);
    formData.append('resume', resumeFile);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/evaluate', formData);
      setResult(res.data.result || res.data);
    } catch (err) {
      console.error(err);
      alert('Error evaluating resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Resume Evaluator</h1>

      <textarea
        className="w-full p-3 border border-gray-300 rounded mb-5 focus:outline-none focus:ring focus:ring-blue-200"
        rows="6"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setResumeFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {result && (
        <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Evaluation Summary</h2>

          <div className="mb-6">
            <p className="text-lg"><strong>Match Percentage:</strong> <span className="text-green-600 font-bold">{result.match_percentage}%</span></p>
            <p className="text-lg"><strong>Ranking:</strong> <span className="text-blue-700 font-semibold">{result.ranking}</span></p>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-gray-700">Keyword Match</h3>
          <table className="w-full table-auto border border-gray-300 mb-6">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 border">Keyword</th>
                <th className="p-2 border">Present</th>
                <th className="p-2 border">Match %</th>
              </tr>
            </thead>
            <tbody>
              {result.keywords.map((kw, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{kw.keyword}</td>
                  <td className={`border p-2 ${kw.present ? 'text-green-600' : 'text-red-600'}`}>
                    {kw.present ? 'Yes' : 'No'}
                  </td>
                  <td className="border p-2">{kw.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-lg font-semibold mb-2 text-gray-700">Suggestions to Improve Resume</h3>
          <ul className="list-disc pl-5 text-gray-800 space-y-1">
            {result.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;

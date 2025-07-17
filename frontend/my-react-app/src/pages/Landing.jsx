import React, { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';

function Landing() {
  const { userData } = useContext(AuthContext);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <section
        className="relative bg-cover bg-center h-[90vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        <div className="w-full text-center text-white px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Find Your Dream Job with JobConnect
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 drop-shadow-md">
            Post jobs or apply with ease. Connect with top talent and opportunities today.
          </p>
          {userData && (
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/search"
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Search for Jobs
              </a>
              <a
                href="/post-job"
                className="border-2 border-white text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Post a Job
              </a>
              <a
                href="/check-resume-score"
                className="border-2 border-white text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Check Resume Score
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose JobConnect?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center">
              <i className="fas fa-search text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Search Jobs</h3>
              <p className="text-gray-600">Explore thousands of job listings tailored to your skills and interests.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center">
              <i className="fas fa-file-upload text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Applications</h3>
              <p className="text-gray-600">Upload your resume and apply to jobs with a single click.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-center">
              <i className="fas fa-briefcase text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hire Talent</h3>
              <p className="text-gray-600">Post jobs and connect with top candidates effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ⚠️ Warning Section */}
      <section className="bg-yellow-100 border-t border-yellow-300 py-8">
  <div className="max-w-5xl mx-auto px-6 text-center">
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="text-yellow-700 text-2xl">⚠️</span>
      <h2 className="text-2xl font-bold text-yellow-800">Important Notice</h2>
    </div>
    <p className="text-yellow-800 text-lg font-medium">
      We <strong>do not charge any cost</strong> for any job or internship. If anyone asks you for payment,
      please reach out to us immediately:
    </p>
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-yellow-900 text-base font-medium">
      <div className="flex items-center gap-2">
        <i className="fas fa-envelope text-blue-700"></i>
        <a
          href="mailto:jobconnectadmin@gmail.com"
          className="underline hover:text-blue-900"
        >
          jobconnectadmin@gmail.com
        </a>
      </div>
      <div className="flex items-center gap-2">
        <i className="fas fa-phone-alt text-blue-700"></i>
        <a href="tel:9876543210" className="underline hover:text-blue-900">
          9876543210
        </a>
      </div>
    </div>
  </div>
</section>


      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-sm">&copy; 2025 JobConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

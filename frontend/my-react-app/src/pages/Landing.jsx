import React, { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';

function Landing() {
  const { userData } = useContext(AuthContext);
  console.log(userData);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-16 mx-0 gap-2 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-4xl text-white">
                <i className="fas fa-briefcase"></i>
              </span>
              <span className="text-2xl font-bold text-white tracking-wide">JobConnect</span>
            </div>

            {userData ? (
              // Show these if userData exists (user is logged in)
              <div className="hidden sm:flex items-center space-x-6">
                {/* Profile Photo */}
                <a href="/profile">
                  <img
                    src={userData.profilePhoto.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwTjn7ADTGtefL4Im3WluJ6ersByvJf8k7-Q&s"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover "
                  />
                </a>
                <a href="/logout" className="text-white">Logout</a>
              </div>
            ) : (
              // Show these if no userData (user not logged in)
              <div className="hidden sm:flex items-center space-x-6">
                <a href="/login" className="px-4 py-1 text-sm font-medium text-white border border-white rounded-full hover:bg-white hover:text-blue-700 transition duration-200">Login</a>
                <a href="/register" className="px-4 py-1 text-sm font-medium text-blue-600 bg-white rounded-full hover:bg-gray-200 transition duration-200">Sign Up</a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center">
              <button
                type="button"
                className="text-white hover:text-gray-200 focus:outline-none"
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  menu.classList.toggle('hidden');
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className="sm:hidden hidden bg-blue-700" id="mobile-menu">
          <div className="px-4 pt-4 pb-2 space-y-2 text-white">
            <a href="/" className="block hover:text-gray-200 font-medium">Home</a>
            <a href="/search" className="block hover:text-gray-200 font-medium">Search Job</a>
            <a href="/post-job" className="block hover:text-gray-200 font-medium">Post a Job</a>
            {userData ? (
              <>
                <a href="/profile" className="block hover:text-gray-200 font-medium">Profile</a>
                <a href="/logout" className="block hover:text-gray-200 font-medium">Logout</a>
              </>
            ) : (
              <>
                <a href="/login" className="block border-t border-gray-400 pt-2 font-medium">Login</a>
                <a href="/register" className="block bg-white text-blue-700 px-4 py-2 rounded-md text-center font-medium">Sign Up</a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              {userData.role === 'developer' && (
                <a
                  href="/search"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Search for Jobs
                </a>
              )}
              {userData.role === 'recruiter' && (
                <a
                  href="/post-job"
                  className="border-2 border-white text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
                >
                  Post a Job
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-sm">&copy; 2025 JobConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

import React, { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { userData,logout } = useContext(AuthContext);
   const navigate = useNavigate();

   const handleLogout = () => {
    logout();
    navigate('/'); // redirect after logout
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between h-16 mx-0 gap-2 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-4xl text-white">
              <i className="fas fa-briefcase"></i>
            </span>
            <a href="/" className="text-2xl font-bold text-white tracking-wide">JobConnect</a>
          </div>

          {userData ? (
            <div className="hidden sm:flex items-center space-x-6">
              <a href="/profile">
                <img
                  src={userData.profilePhoto.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwTjn7ADTGtefL4Im3WluJ6ersByvJf8k7-Q&s"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover "
                />
              </a>
              <button onClick={handleLogout} className="text-white">
                Logout
            </button>
              <a
                href={`/user/${userData._id}`}
                className="px-4 py-1 text-sm font-medium text-white border border-white rounded-full hover:bg-white hover:text-blue-700 transition duration-200"
              >
                See Posted Jobs
              </a>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-6">
              <a href="/login" className="px-4 py-1 text-sm font-medium text-white border border-white rounded-full hover:bg-white hover:text-blue-700 transition duration-200">Login</a>
              <a href="/register" className="px-4 py-1 text-sm font-medium text-blue-600 bg-white rounded-full hover:bg-gray-200 transition duration-200">Sign Up</a>
            </div>
          )}

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

      <div className="sm:hidden hidden bg-blue-700" id="mobile-menu">
        <div className="px-4 pt-4 pb-2 space-y-2 text-white">
          <a href="/" className="block hover:text-gray-200 font-medium">Home</a>
          <a href="/search" className="block hover:text-gray-200 font-medium">Search Job</a>
          <a href="/post-job" className="block hover:text-gray-200 font-medium">Post a Job</a>
          {userData ? (
            <>
              <a href="/profile" className="block hover:text-gray-200 font-medium">Profile</a>
            <button onClick={handleLogout} className="text-white">
                Logout
            </button>
              <a href={`/user/${userData._id}`} className="block hover:text-gray-200 font-medium">See Posted Jobs</a>
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
  );
}

export default Navbar;

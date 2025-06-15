import React, { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(userData);

  if (!userData) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading User Data...</div>;
  }

  // Destructuring the about information
  const { about } = userData;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src={userData.profilePhoto?.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwTjn7ADTGtefL4Im3WluJ6ersByvJf8k7-Q&s"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold">{userData.name}</h2>
          <p className="text-gray-600">@{userData.username}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-gray-500 text-sm">Email</h4>
            <p className="text-gray-800">{userData.email}</p>
          </div>
          <div>
            <h4 className="text-gray-500 text-sm">Role</h4>
            <p className="text-gray-800 capitalize">{userData.role}</p>
          </div>
          {/* Displaying About Information */}
          <div>
            <h4 className="text-gray-500 text-sm">Description</h4>
            <p className="text-gray-800">{about?.description || 'No description available'}</p>
          </div>
          <div>
            <h4 className="text-gray-500 text-sm">Skills</h4>
            <p className="text-gray-800">{about?.skillSet || 'No skill set available'}</p>
          </div>
          <div>
            <h4 className="text-gray-500 text-sm">Experience</h4>
            <p className="text-gray-800">{about?.experience || 'No experience listed'}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/editProfile')}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

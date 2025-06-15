import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Authentication from './pages/Authentication';
import { AuthProvider } from './context/Authcontext';
import Jobposting from './pages/Jobposting.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import SearchJob from './pages/SearchJob.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Authentication />} />
        <Route path="/register" element={<Authentication />} />
        <Route path="/logout" element={<Authentication/>}/>
        <Route path="/post-job" element={<Jobposting/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/editProfile" element={<EditProfile/>}/>
        <Route path = "/search" element = {<SearchJob/>}/>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import StudentPortal from './pages/StudentPortal/StudentPortal';
import ProfessorPortal from './pages/ProfessorPortal/ProfessorPortal';
import CourseCatalog from './pages/CourseCatalog/CourseCatalog';
import ClubList from './pages/ClubList/ClubList';
import EventCalendar from './pages/EventCalendar/EventCalendar';
import Profile from './pages/Profile/Profile';
import Navbar from './components/Navbar/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'student' or 'professor'
  const [asurite, setAsurite] = useState(null);   // store the user's Asurite ID

  const handleLogin = (type, id) => {
    setIsLoggedIn(true);
    setUserType(type);
    setAsurite(id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setAsurite(null);
  };

  return (
    <Router>
      {/* Show navbar only after login */}
      {isLoggedIn && <Navbar userType={userType} onLogout={handleLogout} />}

      <Routes>
        {/* Login page */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to={userType === 'student' ? '/student' : '/professor'} />
            )
          }
        />

        {/* Profile page */}
        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile asurite={asurite} /> : <Navigate to="/login" />
          }
        />

        {/* Portals */}
        <Route
          path="/student"
          element={
            userType === 'student' ? <StudentPortal asurite={asurite} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/professor"
          element={
            userType === 'professor' ? <ProfessorPortal asurite={asurite} /> : <Navigate to="/login" />
          }
        />

        {/* Other pages */}
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/clubs" element={<ClubList />} />
        <Route path="/events" element={<EventCalendar />} />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isLoggedIn
                  ? userType === 'student'
                    ? '/student'
                    : '/professor'
                  : '/login'
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

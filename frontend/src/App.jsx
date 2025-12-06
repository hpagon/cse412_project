import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import StudentPortal from "./pages/StudentPortal/StudentPortal";
import ProfessorPortal from "./pages/ProfessorPortal/ProfessorPortal";
import CourseCatalog from "./pages/CourseCatalog/CourseCatalog";
import ClubList from "./pages/ClubList/ClubList";
import EventCalendar from "./pages/EventCalendar/EventCalendar";
import Profile from "./pages/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'student' or 'professor'
  const [user, setUser] = useState(null); // store full user profile

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserType(userData.role);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUser(null);
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
              <Navigate
                to={userType === "student" ? "/student" : "/professor"}
              />
            )
          }
        />

        {/* Profile page */}
        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile user={user} /> : <Navigate to="/login" />
          }
        />

        {/* Portals */}
        <Route
          path="/student"
          element={
            userType === "student" ? (
              <StudentPortal user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/professor"
          element={
            userType === "professor" ? (
              <ProfessorPortal user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Other pages */}
        <Route path="/courses" element={<CourseCatalog user={user} />} />
        <Route path="/clubs" element={<ClubList user={user} />} />
        <Route path="/events" element={<EventCalendar user={user} />} />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isLoggedIn
                  ? userType === "student"
                    ? "/student"
                    : "/professor"
                  : "/login"
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

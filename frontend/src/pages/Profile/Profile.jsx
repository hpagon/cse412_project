import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";
import "./Profile.css";

const API_URL = "http://localhost:3000/api";

const Profile = ({ user }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.asuid) return;

    const fetchClubs = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/clubs/student/${user.asuid}`
        );
        setClubs(response.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [user]);

  if (!user) {
    return <div>No user data available.</div>;
  }

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile">
        <h2>
          Profile: {user.firstname} {user.lastname}
        </h2>
        <p>
          <strong>ASURITE ID:</strong> {user.asuriteuserid}
        </p>
        <p>
          <strong>Date of Birth:</strong> {formatDate(user.dob)}
        </p>

        {user.role === "student" && (
          <>
            <h3>Student Info</h3>
            <p>
              <strong>Enrollment Date:</strong>{" "}
              {formatDate(user.enrollmentdate)}
            </p>
            <p>
              <strong>Graduation Date:</strong> {formatDate(user.graddate)}
            </p>
            <p>
              <strong>Major:</strong> {user.major}
            </p>
            <p>
              <strong>Minor:</strong> {user.minor || "N/A"}
            </p>
            <p>
              <strong>GPA:</strong> {user.gpa}
            </p>
          </>
        )}

        {user.role === "professor" && (
          <>
            <h3>Professor Info</h3>
            <p>
              <strong>Office:</strong> {user.officenumber || "N/A"}
            </p>
            <p>
              <strong>Hire Date:</strong> {formatDate(user.hiredate)}
            </p>
            <p>
              <strong>Rank:</strong> {user.rank}
            </p>
          </>
        )}

        {clubs.length > 0 && (
          <>
            <h3>Clubs</h3>
            <ul>
              {clubs.map((c) => (
                <li key={c.clubid}>{c.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

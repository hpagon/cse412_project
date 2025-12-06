import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";
import "./ProfessorPortal.css";

const API_URL = "http://localhost:3000/api";

const ProfessorPortal = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.asuid) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/courses/professor/${user.asuid}`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching professor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return <div>No user data provided.</div>;
  if (loading) return <div>Loading professor portal...</div>;

  return (
    <div className="professor-portal">
      <div className="left-card">
        <h3>Professor Profile</h3>
        <p>
          <strong>Name:</strong> {user.firstname} {user.middlename || ""}{" "}
          {user.lastname}
        </p>
        <p>
          <strong>ASURITE ID:</strong> {user.asuriteuserid}
        </p>
        <p>
          <strong>Date of Birth:</strong> {formatDate(user.dob)}
        </p>
        <hr />
        <p>
          <strong>Office:</strong> {user.officenumber || "N/A"}
        </p>
        <p>
          <strong>Hire Date:</strong> {formatDate(user.hiredate)}
        </p>
        <p>
          <strong>Rank:</strong> {user.rank}
        </p>
      </div>

      <div className="right-column">
        <div className="right-card">
          <h3>Courses Teaching</h3>
          {courses.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Enrolled</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.courseid}>
                    <td>{c.courseid}</td>
                    <td>{c.coursename}</td>
                    <td>{c.creditnumber}</td>
                    <td>{c.enrolled_count || 0}</td>
                    <td>
                      {c.building ? `${c.building} ${c.roomnumber}` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Not teaching any courses.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorPortal;

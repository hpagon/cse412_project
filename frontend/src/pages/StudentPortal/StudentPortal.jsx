import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentPortal.css";

const API_URL = "http://localhost:3000/api";
const ITEMS_PER_PAGE = 5;

const StudentPortal = ({ user }) => {
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentClubs, setStudentClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.asuid) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch courses, clubs, and events in parallel
        const [coursesRes, clubsRes, eventsRes] = await Promise.all([
          axios.get(`${API_URL}/courses/student/${user.asuid}`),
          axios.get(`${API_URL}/clubs/student/${user.asuid}`),
          axios.get(`${API_URL}/events/student/${user.asuid}`),
        ]);

        setStudentCourses(coursesRes.data);
        setStudentClubs(clubsRes.data);

        // Split events into upcoming and attended
        const now = new Date();
        const upcoming = eventsRes.data.filter((e) => new Date(e.date) >= now);
        const attended = eventsRes.data.filter((e) => new Date(e.date) < now);

        setUpcomingEvents(upcoming);
        setAttendedEvents(attended);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const totalPages = Math.ceil(studentCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = studentCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  if (!user) return <div>No user data provided.</div>;
  if (loading) return <div>Loading student portal...</div>;

  return (
    <div className="student-portal-container">
      {/* Profile Card */}
      <div className="left-card">
        <h3>Student Profile</h3>
        <p>
          <strong>Name:</strong> {user.firstname} {user.middlename || ""}{" "}
          {user.lastname}
        </p>
        <p>
          <strong>ASURITE ID:</strong> {user.asuriteuserid}
        </p>
        <p>
          <strong>Date of Birth:</strong> {user.dob}
        </p>
        <hr />
        <p>
          <strong>Enrollment Date:</strong> {user.enrollmentdate}
        </p>
        <p>
          <strong>Graduation Date:</strong> {user.graddate || "N/A"}
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
      </div>

      {/* Right Column */}
      <div className="right-column">
        {/* Courses */}
        <div className="right-card">
          <h3>Enrolled Courses</h3>
          {paginatedCourses.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course Name</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.map((c) => (
                    <tr key={c.courseid}>
                      <td>{c.courseid}</td>
                      <td>{c.coursename}</td>
                      <td>{c.creditnumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {studentCourses.length > ITEMS_PER_PAGE && (
                <div className="pagination">
                  <button onClick={handlePrev} disabled={currentPage === 1}>
                    Prev
                  </button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No courses enrolled.</p>
          )}
        </div>

        {/* Clubs */}
        <div className="right-card">
          <h3>Clubs</h3>
          {studentClubs.length > 0 ? (
            <ul>
              {studentClubs.map((c) => (
                <li key={c.clubid}>
                  {c.name}: {c.description || "No description"}
                </li>
              ))}
            </ul>
          ) : (
            <p>Not part of any club.</p>
          )}
        </div>

        {/* Events */}
        <div className="right-card">
          <h3>Events</h3>
          <div>
            <h4>Upcoming Events</h4>
            {upcomingEvents.length > 0 ? (
              <ul>
                {upcomingEvents.map((e) => (
                  <li key={e.eventid}>
                    {e?.date || "N/A"} | {e?.starttime || "N/A"} -{" "}
                    {e?.endtime || "N/A"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming events.</p>
            )}
          </div>
          <div>
            <h4 className="attended-heading"> Attended Events</h4>
            {attendedEvents.length > 0 ? (
              <ul>
                {attendedEvents.map((e) => (
                  <li key={e.eventid}>
                    {e?.date || "N/A"} | {e?.starttime || "N/A"} -{" "}
                    {e?.endtime || "N/A"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attended events yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;

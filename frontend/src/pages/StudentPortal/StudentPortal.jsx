import React, { useState, useEffect } from 'react';
import peopleData from '../../mockdata/People.json';
import studentsData from '../../mockdata/Students.json';
import attendsCourseData from '../../mockdata/Attends_Course.json';
import coursesData from '../../mockdata/Courses.json';
import attendsClubData from '../../mockdata/Attends_Club.json';
import clubsData from '../../mockdata/Clubs.json';
import hostData from '../../mockdata/Host.json';
import eventsData from '../../mockdata/Event.json';
import './StudentPortal.css';

const ITEMS_PER_PAGE = 5;

const StudentPortal = ({ asurite }) => {
  const [personInfo, setPersonInfo] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [studentClubs, setStudentClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!asurite) return;

    const person = peopleData.find(p => p.asuriteUserID === asurite);
    setPersonInfo(person);
    if (!person) return;

    const student = studentsData.find(s => s.ASUID === person.ASUID);
    setStudentInfo(student);
    if (!student) return;

    // Courses
    const courseIDs = attendsCourseData
      .filter(ac => ac.ASUID === student.ASUID)
      .map(ac => ac.courseID);
    setStudentCourses(coursesData.filter(c => courseIDs.includes(c.courseID)));

    // Clubs
    const clubIDs = attendsClubData
      .filter(ac => ac.ASUID === student.ASUID)
      .map(ac => ac.clubID);
    setStudentClubs(clubsData.filter(c => clubIDs.includes(c.clubID)));

    // Events
    const eventIDs = hostData
      .filter(h => clubIDs.includes(h.clubID))
      .map(h => h.eventID);
    const allEvents = eventsData.filter(e => eventIDs.includes(e.eventID));

    const now = new Date();
    const upcoming = allEvents.filter(e => new Date(e.date) >= now);
    const attended = allEvents.filter(e => new Date(e.date) < now);

    setUpcomingEvents(upcoming);
    setAttendedEvents(attended);

    setCurrentPage(1);
  }, [asurite]);

  const totalPages = Math.ceil(studentCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = studentCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  if (!personInfo) return <div>{asurite ? "Student not found." : "No ASURITE ID provided."}</div>;
  if (!studentInfo) return <div>Loading student portal...</div>;

  return (
    <div className="student-portal-container">
      {/* Profile Card */}
      <div className="left-card">
        <h3>Student Profile</h3>
        <p><strong>Name:</strong> {personInfo.firstName} {personInfo.middleName || ''} {personInfo.lastName}</p>
        <p><strong>ASURITE ID:</strong> {personInfo.asuriteUserID}</p>
        <p><strong>Date of Birth:</strong> {personInfo.DOB}</p>
        <hr />
        <p><strong>Enrollment Date:</strong> {studentInfo.enrollmentDate}</p>
        <p><strong>Graduation Date:</strong> {studentInfo.gradDate}</p>
        <p><strong>Major:</strong> {studentInfo.Major}</p>
        <p><strong>Minor:</strong> {studentInfo.Minor || 'N/A'}</p>
        <p><strong>GPA:</strong> {studentInfo.GPA}</p>
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
                  {paginatedCourses.map(c => (
                    <tr key={c.courseID}>
                      <td>{c.courseID}</td>
                      <td>{c.courseName}</td>
                      <td>{c.creditNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {studentCourses.length > ITEMS_PER_PAGE && (
                <div className="pagination">
                  <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
                  <span>{currentPage} / {totalPages}</span>
                  <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
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
              {studentClubs.map(c => <li key={c.clubID}>{c.name}: {c.description || 'No description'}</li>)}
            </ul>
          ) : <p>Not part of any club.</p>}
        </div>

        {/* Events */}
        <div className="right-card">
          <h3>Events</h3>
          <div>
            <h4>Upcoming Events</h4>
            {upcomingEvents.length > 0 ? (
              <ul>
                {upcomingEvents.map(e => (
                  <li key={e.eventID}>
                    {e?.date || 'N/A'} | {e?.startTime || 'N/A'} - {e?.endTime || 'N/A'}
                  </li>
                ))}
              </ul>
            ) : <p>No upcoming events.</p>}
          </div>
          <div>
            <h4 className="attended-heading"> Attended Events</h4>
            {attendedEvents.length > 0 ? (
              <ul>
                {attendedEvents.map(e => (
                  <li key={e.eventID}>
                    {e?.date || 'N/A'} | {e?.startTime || 'N/A'} - {e?.endTime || 'N/A'}
                  </li>
                ))}
              </ul>
            ) : <p>No attended events yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;

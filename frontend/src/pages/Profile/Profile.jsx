import React, { useEffect, useState } from 'react';
import './Profile.css';

// Import mock data
import peopleData from '../../mockdata/People.json';
import studentsData from '../../mockdata/Students.json';
import clubsData from '../../mockdata/Clubs.json';
import attendsClubData from '../../mockdata/Attends_Club.json';

const Profile = ({ asurite }) => {
  const [personInfo, setPersonInfo] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentClubs, setStudentClubs] = useState([]);

  useEffect(() => {
    if (!asurite) return;

    // Find person by asuriteUserID
    const person = peopleData.find(p => p.asuriteUserID === asurite);
    setPersonInfo(person);

    if (person) {
      // Find student info by ASUID
      const student = studentsData.find(s => s.ASUID === person.ASUID);
      setStudentInfo(student);

      // Find clubs the student is in
      const clubIds = attendsClubData
        .filter(ac => ac.ASUID === person.ASUID)
        .map(ac => ac.clubID);

      const clubs = clubsData.filter(c => clubIds.includes(c.clubID));
      setStudentClubs(clubs);
    }
  }, [asurite]);

  if (!personInfo) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-wrapper">
  <div className="profile">
    <h2>Profile: {personInfo.firstName} {personInfo.lastName}</h2>
    <p><strong>ASURITE ID:</strong> {personInfo.asuriteUserID}</p>
    <p><strong>Date of Birth:</strong> {personInfo.DOB}</p>

    {studentInfo && (
      <>
        <h3>Student Info</h3>
        <p><strong>Enrollment Date:</strong> {studentInfo.enrollmentDate}</p>
        <p><strong>Graduation Date:</strong> {studentInfo.gradDate}</p>
        <p><strong>Major:</strong> {studentInfo.Major}</p>
        <p><strong>Minor:</strong> {studentInfo.Minor}</p>
        <p><strong>GPA:</strong> {studentInfo.GPA}</p>
      </>
    )}

    {studentClubs.length > 0 && (
      <>
        <h3>Clubs</h3>
        <ul>
          {studentClubs.map(c => (
            <li key={c.clubID}>{c.name}</li>
          ))}
        </ul>
      </>
    )}
  </div>
</div>

  );
};

export default Profile;

import React, { useState } from 'react';
import coursesData from '../../mockdata/Courses.json';
import teachesData from '../../mockdata/Teaches.json';
import professorsData from '../../mockdata/Professors.json';
import foundInCourseData from '../../mockdata/FoundIn_Course.json';
import locationsData from '../../mockdata/Location.json';
import './CourseCatalog.css';

const ITEMS_PER_PAGE = 10;

const CourseCatalog = () => {
  const [filteredCourses, setFilteredCourses] = useState(coursesData);
  const [filters, setFilters] = useState({ name: '', credit: '', instructor: '', campus: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    let result = coursesData;

    if (filters.name) {
      result = result.filter(c => c.courseName.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.credit) {
      result = result.filter(c => c.creditNumber === Number(filters.credit));
    }
    if (filters.instructor) {
      const matchedCourseIDs = teachesData
        .filter(t => {
          const prof = professorsData.find(p => p.ASUID === t.ASUID);
          return prof && `${prof.firstName} ${prof.lastName}`.toLowerCase().includes(filters.instructor.toLowerCase());
        })
        .map(t => t.courseID);
      result = result.filter(c => matchedCourseIDs.includes(c.courseID));
    }
    if (filters.campus) {
      const matchedCourseIDs = foundInCourseData
        .filter(f => {
          const loc = locationsData.find(l => l.locationID === f.locationID);
          return loc && loc.campus.toLowerCase().includes(filters.campus.toLowerCase());
        })
        .map(f => f.courseID);
      result = result.filter(c => matchedCourseIDs.includes(c.courseID));
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({ name: '', credit: '', instructor: '', campus: '' });
    setFilteredCourses(coursesData);
    setCurrentPage(1);
  };

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="course-catalog-container">
      <div className="filter-card">
        <h3>Filters</h3>
        <input type="text" placeholder="Course Name" name="name" value={filters.name} onChange={handleFilterChange} />
        <input type="number" placeholder="Credit Number" name="credit" value={filters.credit} onChange={handleFilterChange} />
        <input type="text" placeholder="Instructor" name="instructor" value={filters.instructor} onChange={handleFilterChange} />
        <input type="text" placeholder="Campus" name="campus" value={filters.campus} onChange={handleFilterChange} />
        <div className="filter-buttons">
          <button className="search-btn" onClick={handleSearch}>Search</button>
          <button className="clear-btn" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="table-card">
        <h3>Course Catalog</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Credit</th>
              <th>Instructor</th>
              <th>Campus</th>
              <th>Room</th>
              <th>Building</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCourses.map(course => {
              const teach = teachesData.find(t => t.courseID === course.courseID);
              const prof = teach ? professorsData.find(p => p.ASUID === teach.ASUID) : null;
              const found = foundInCourseData.find(f => f.courseID === course.courseID);
              const loc = found ? locationsData.find(l => l.locationID === found.locationID) : {};

              return (
                <tr key={course.courseID}>
                  <td title={course.courseID}>{course.courseID}</td>
                  <td title={course.courseName}>{course.courseName}</td>
                  <td title={course.creditNumber}>{course.creditNumber}</td>
                  <td title={prof ? `${prof.firstName} ${prof.lastName}` : 'N/A'}>
                    {prof ? `${prof.firstName} ${prof.lastName}` : 'N/A'}
                  </td>
                  <td title={loc.campus || 'N/A'}>{loc.campus || 'N/A'}</td>
                  <td title={loc.roomNumber || 'N/A'}>{loc.roomNumber || 'N/A'}</td>
                  <td title={loc.building || 'N/A'}>{loc.building || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCourses.length > ITEMS_PER_PAGE && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CourseCatalog.css";

const API_URL = "http://localhost:3000/api";
const ITEMS_PER_PAGE = 10;

const CourseCatalog = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({ name: "", credit: "", campus: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses`);
        setAllCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    let result = allCourses;

    if (filters.name) {
      result = result.filter((c) =>
        c.coursename.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.credit) {
      result = result.filter((c) => c.creditnumber === Number(filters.credit));
    }
    if (filters.campus) {
      result = result.filter(
        (c) =>
          c.campus &&
          c.campus.toLowerCase().includes(filters.campus.toLowerCase())
      );
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({ name: "", credit: "", campus: "" });
    setFilteredCourses(allCourses);
    setCurrentPage(1);
  };

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="course-catalog-container">
      <div className="filter-card">
        <h3>Filters</h3>
        <input
          type="text"
          placeholder="Course Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Credit Number"
          name="credit"
          value={filters.credit}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Campus"
          name="campus"
          value={filters.campus}
          onChange={handleFilterChange}
        />
        <div className="filter-buttons">
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
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
              <th>Campus</th>
              <th>Building</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading courses...</td>
              </tr>
            ) : (
              paginatedCourses.map((course) => (
                <tr key={course.courseid}>
                  <td title={course.courseid}>{course.courseid}</td>
                  <td title={course.coursename}>{course.coursename}</td>
                  <td title={course.creditnumber}>{course.creditnumber}</td>
                  <td title={course.campus || "N/A"}>
                    {course.campus || "N/A"}
                  </td>
                  <td title={course.building || "N/A"}>
                    {course.building || "N/A"}
                  </td>
                  <td title={course.roomnumber || "N/A"}>
                    {course.roomnumber || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filteredCourses.length > ITEMS_PER_PAGE && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Prev
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;

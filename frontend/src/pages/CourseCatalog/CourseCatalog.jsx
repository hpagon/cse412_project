import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CourseCatalog.css";

const API_URL = "http://localhost:3000/api";
const ITEMS_PER_PAGE = 10;

const CourseCatalog = ({ user }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filters, setFilters] = useState({ name: "", credit: "", campus: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

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

  const fetchEnrolled = async () => {
    if (!user?.asuid) return;
    try {
      if (user.role === "student") {
        const response = await axios.get(
          `${API_URL}/courses/student/${user.asuid}`
        );
        setEnrolledCourses(response.data.map((c) => c.courseid));
      } else if (user.role === "professor") {
        const response = await axios.get(
          `${API_URL}/courses/professor/${user.asuid}`
        );
        setEnrolledCourses(response.data.map((c) => c.courseid));
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrolled();
  }, [user]);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`${API_URL}/courses/enroll`, {
        asuid: user.asuid,
        courseId: courseId,
      });
      setEnrolledCourses([...enrolledCourses, courseId]);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to enroll");
    }
  };

  const handleDrop = async (courseId) => {
    try {
      await axios.delete(`${API_URL}/courses/drop`, {
        data: { asuid: user.asuid, courseId: courseId },
      });
      setEnrolledCourses(enrolledCourses.filter((id) => id !== courseId));
    } catch (error) {
      alert(error.response?.data?.error || "Failed to drop course");
    }
  };

  const handleTeach = async (courseId) => {
    try {
      await axios.post(`${API_URL}/courses/teach`, {
        asuid: user.asuid,
        courseId: courseId,
      });
      setEnrolledCourses([...enrolledCourses, courseId]);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to sign up to teach");
    }
  };

  const handleUnteach = async (courseId) => {
    try {
      await axios.delete(`${API_URL}/courses/unteach`, {
        data: { asuid: user.asuid, courseId: courseId },
      });
      setEnrolledCourses(enrolledCourses.filter((id) => id !== courseId));
    } catch (error) {
      alert(error.response?.data?.error || "Failed to remove from teaching");
    }
  };

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
              {user && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={user ? "7" : "6"}>Loading courses...</td>
              </tr>
            ) : (
              paginatedCourses.map((course) => {
                const isEnrolled = enrolledCourses.includes(course.courseid);
                return (
                  <tr key={course.courseid}>
                    <td>{course.courseid}</td>
                    <td>{course.coursename}</td>
                    <td>{course.creditnumber}</td>
                    <td>{course.campus || "N/A"}</td>
                    <td>{course.building || "N/A"}</td>
                    <td>{course.roomnumber || "N/A"}</td>
                    {user && (
                      <td>
                        {user.role === "student" ? (
                          isEnrolled ? (
                            <button
                              className="drop-btn"
                              onClick={() => handleDrop(course.courseid)}
                            >
                              Drop
                            </button>
                          ) : (
                            <button
                              className="enroll-btn"
                              onClick={() => handleEnroll(course.courseid)}
                            >
                              Enroll
                            </button>
                          )
                        ) : user.role === "professor" ? (
                          isEnrolled ? (
                            <button
                              className="drop-btn"
                              onClick={() => handleUnteach(course.courseid)}
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              className="enroll-btn"
                              onClick={() => handleTeach(course.courseid)}
                            >
                              Teach
                            </button>
                          )
                        ) : null}
                      </td>
                    )}
                  </tr>
                );
              })
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

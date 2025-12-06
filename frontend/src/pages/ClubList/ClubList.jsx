import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ClubList.css";

const API_URL = "http://localhost:3000/api";
const ITEMS_PER_PAGE = 10;

const Clubs = ({ user }) => {
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    description: "",
    minMembers: "",
    maxMembers: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchClubs = async () => {
    try {
      const response = await axios.get(`${API_URL}/clubs`);
      setAllClubs(response.data);
      setFilteredClubs(response.data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedClubs = async () => {
    if (!user?.asuid || user.role !== "student") return;
    try {
      const response = await axios.get(
        `${API_URL}/clubs/student/${user.asuid}`
      );
      setJoinedClubs(response.data.map((c) => c.clubid));
    } catch (error) {
      console.error("Error fetching joined clubs:", error);
    }
  };

  useEffect(() => {
    fetchClubs();
    fetchJoinedClubs();
  }, [user]);

  const handleJoin = async (clubId) => {
    try {
      await axios.post(`${API_URL}/clubs/join`, {
        asuid: user.asuid,
        clubId: clubId,
      });
      setJoinedClubs([...joinedClubs, clubId]);
      // Update member count in UI
      setAllClubs(
        allClubs.map((c) =>
          c.clubid === clubId ? { ...c, membercount: c.membercount + 1 } : c
        )
      );
      setFilteredClubs(
        filteredClubs.map((c) =>
          c.clubid === clubId ? { ...c, membercount: c.membercount + 1 } : c
        )
      );
    } catch (error) {
      alert(error.response?.data?.error || "Failed to join club");
    }
  };

  const handleLeave = async (clubId) => {
    try {
      await axios.delete(`${API_URL}/clubs/leave`, {
        data: { asuid: user.asuid, clubId: clubId },
      });
      setJoinedClubs(joinedClubs.filter((id) => id !== clubId));
      // Update member count in UI
      setAllClubs(
        allClubs.map((c) =>
          c.clubid === clubId ? { ...c, membercount: c.membercount - 1 } : c
        )
      );
      setFilteredClubs(
        filteredClubs.map((c) =>
          c.clubid === clubId ? { ...c, membercount: c.membercount - 1 } : c
        )
      );
    } catch (error) {
      alert(error.response?.data?.error || "Failed to leave club");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    let result = allClubs;

    if (filters.name) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.description) {
      result = result.filter(
        (c) =>
          c.description &&
          c.description
            .toLowerCase()
            .includes(filters.description.toLowerCase())
      );
    }
    if (filters.minMembers) {
      result = result.filter(
        (c) => c.membercount >= Number(filters.minMembers)
      );
    }
    if (filters.maxMembers) {
      result = result.filter(
        (c) => c.membercount <= Number(filters.maxMembers)
      );
    }

    setFilteredClubs(result);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({ name: "", description: "", minMembers: "", maxMembers: "" });
    setFilteredClubs(allClubs);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClubs = filteredClubs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredClubs.length / ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="clubs-container">
      <div className="filter-card">
        <h3>Filters</h3>
        <input
          type="text"
          placeholder="Club Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Description Keyword"
          name="description"
          value={filters.description}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Min Members"
          name="minMembers"
          value={filters.minMembers}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Max Members"
          name="maxMembers"
          value={filters.maxMembers}
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
        <h3>Clubs</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Members</th>
              {user?.role === "student" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={user?.role === "student" ? "5" : "4"}>
                  Loading clubs...
                </td>
              </tr>
            ) : (
              paginatedClubs.map((c) => {
                const isMember = joinedClubs.includes(c.clubid);
                return (
                  <tr key={c.clubid}>
                    <td>{c.clubid}</td>
                    <td>{c.name}</td>
                    <td title={c.description}>{c.description}</td>
                    <td>{c.membercount}</td>
                    {user?.role === "student" && (
                      <td>
                        {isMember ? (
                          <button
                            className="drop-btn"
                            onClick={() => handleLeave(c.clubid)}
                          >
                            Leave
                          </button>
                        ) : (
                          <button
                            className="enroll-btn"
                            onClick={() => handleJoin(c.clubid)}
                          >
                            Join
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {filteredClubs.length > ITEMS_PER_PAGE && (
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

export default Clubs;

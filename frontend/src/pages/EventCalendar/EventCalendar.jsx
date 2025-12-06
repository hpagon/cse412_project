import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDate, formatTime } from "../../utils/formatDate";
import "./EventCalendar.css";

const API_URL = "http://localhost:3000/api";
const ITEMS_PER_PAGE = 10;

const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({ date: "", club: "", campus: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        setAllEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    let result = allEvents;

    if (filters.date) {
      result = result.filter((e) => e.date === filters.date);
    }
    if (filters.club) {
      result = result.filter(
        (e) =>
          e.clubname &&
          e.clubname.toLowerCase().includes(filters.club.toLowerCase())
      );
    }
    if (filters.campus) {
      result = result.filter(
        (e) =>
          e.campus &&
          e.campus.toLowerCase().includes(filters.campus.toLowerCase())
      );
    }

    setFilteredEvents(result);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({ date: "", club: "", campus: "" });
    setFilteredEvents(allEvents);
    setCurrentPage(1);
  };

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="events-container">
      <div className="filter-card">
        <h3>Filters</h3>
        <input
          type="date"
          placeholder="Date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Club"
          name="club"
          value={filters.club}
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
        <h3>Events</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Club</th>
              <th>Campus</th>
              <th>Building</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading events...</td>
              </tr>
            ) : (
              paginatedEvents.map((event) => (
                <tr key={event.eventid}>
                  <td>{event.eventid}</td>
                  <td>{formatDate(event.date)}</td>
                  <td>{formatTime(event.starttime)}</td>
                  <td>{formatTime(event.endtime)}</td>
                  <td>{event.clubname || "N/A"}</td>
                  <td>{event.campus || "N/A"}</td>
                  <td>{event.building || "N/A"}</td>
                  <td>{event.roomnumber || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filteredEvents.length > ITEMS_PER_PAGE && (
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

export default Events;

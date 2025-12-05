// src/pages/Events/Events.jsx
import React, { useState } from 'react';
import eventsData from '../../mockdata/Event.json';
import hostData from '../../mockdata/Host.json';
import clubsData from '../../mockdata/Clubs.json';
import locationsData from '../../mockdata/Location.json';
import './EventCalendar.css';

const ITEMS_PER_PAGE = 10;

const Events = () => {
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [filters, setFilters] = useState({ name: '', date: '', club: '', campus: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    let result = eventsData;

    if (filters.name) {
      result = result.filter(e => e.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.date) {
      result = result.filter(e => e.date === filters.date);
    }
    if (filters.club) {
      const matchedEventIDs = hostData
        .filter(h => {
          const club = clubsData.find(c => c.clubID === h.clubID);
          return club && club.name.toLowerCase().includes(filters.club.toLowerCase());
        })
        .map(h => h.eventID);
      result = result.filter(e => matchedEventIDs.includes(e.eventID));
    }
    if (filters.campus) {
      const matchedEventIDs = hostData
        .map(h => h.eventID)
        .filter(eventID => {
          const event = eventsData.find(ev => ev.eventID === eventID);
          const host = hostData.find(h => h.eventID === eventID);
          const club = clubsData.find(c => c.clubID === host.clubID);
          const foundLocation = locationsData.find(l => l.locationID === event.locationID);
          return foundLocation && foundLocation.campus.toLowerCase().includes(filters.campus.toLowerCase());
        });
      result = result.filter(e => matchedEventIDs.includes(e.eventID));
    }

    setFilteredEvents(result);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({ name: '', date: '', club: '', campus: '' });
    setFilteredEvents(eventsData);
    setCurrentPage(1);
  };

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="events-container">
      <div className="filter-card">
        <h3>Filters</h3>
        <input type="text" placeholder="Event Name" name="name" value={filters.name} onChange={handleFilterChange} />
        <input type="date" placeholder="Date" name="date" value={filters.date} onChange={handleFilterChange} />
        <input type="text" placeholder="Club" name="club" value={filters.club} onChange={handleFilterChange} />
        <input type="text" placeholder="Campus" name="campus" value={filters.campus} onChange={handleFilterChange} />
        <div className="filter-buttons">
          <button className="search-btn" onClick={handleSearch}>Search</button>
          <button className="clear-btn" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="table-card">
        <h3>Events</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Club</th>
              <th>Campus</th>
              <th>Room</th>
              <th>Building</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map(event => {
              const host = hostData.find(h => h.eventID === event.eventID);
              const club = host ? clubsData.find(c => c.clubID === host.clubID) : null;
              const loc = locationsData.find(l => l.locationID === event.locationID) || {};

              return (
                <tr key={event.eventID}>
                  <td title={event.eventID}>{event.eventID}</td>
                  <td title={event.name}>{event.name}</td>
                  <td title={event.date}>{event.date}</td>
                  <td title={event.startTime}>{event.startTime}</td>
                  <td title={event.endTime}>{event.endTime}</td>
                  <td title={club ? club.name : 'N/A'}>{club ? club.name : 'N/A'}</td>
                  <td title={loc.campus || 'N/A'}>{loc.campus || 'N/A'}</td>
                  <td title={loc.roomNumber || 'N/A'}>{loc.roomNumber || 'N/A'}</td>
                  <td title={loc.building || 'N/A'}>{loc.building || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredEvents.length > ITEMS_PER_PAGE && (
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

export default Events;

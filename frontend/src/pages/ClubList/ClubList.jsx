import React, { useState } from 'react';
import clubsData from '../../mockdata/Clubs.json';
import './ClubList.css';

const ITEMS_PER_PAGE = 10;

const Clubs = () => {
  const [filteredClubs, setFilteredClubs] = useState(clubsData);
  const [filters, setFilters] = useState({ name: '', description: '', minMembers: '', maxMembers: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    let result = clubsData;

    if (filters.name) {
      result = result.filter(c => c.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.description) {
      result = result.filter(c => c.description.toLowerCase().includes(filters.description.toLowerCase()));
    }
    if (filters.minMembers) {
      result = result.filter(c => c.memberCount >= Number(filters.minMembers));
    }
    if (filters.maxMembers) {
      result = result.filter(c => c.memberCount <= Number(filters.maxMembers));
    }

    setFilteredClubs(result);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({ name: '', description: '', minMembers: '', maxMembers: '' });
    setFilteredClubs(clubsData);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedClubs = filteredClubs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredClubs.length / ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="clubs-container">
      <div className="filter-card">
        <h3>Filters</h3>
        <input type="text" placeholder="Club Name" name="name" value={filters.name} onChange={handleFilterChange} />
        <input type="text" placeholder="Description Keyword" name="description" value={filters.description} onChange={handleFilterChange} />
        <input type="number" placeholder="Min Members" name="minMembers" value={filters.minMembers} onChange={handleFilterChange} />
        <input type="number" placeholder="Max Members" name="maxMembers" value={filters.maxMembers} onChange={handleFilterChange} />
        <div className="filter-buttons">
          <button className="search-btn" onClick={handleSearch}>Search</button>
          <button className="clear-btn" onClick={handleClear}>Clear</button>
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
            </tr>
          </thead>
          <tbody>
            {paginatedClubs.map(c => (
              <tr key={c.clubID}>
                <td>{c.clubID}</td>
                <td>{c.name}</td>
                <td title={c.description}>{c.description}</td>
                <td>{c.memberCount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClubs.length > ITEMS_PER_PAGE && (
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

export default Clubs;

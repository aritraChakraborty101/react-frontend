import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { performSearch } from '../api/api'; // Import the API function

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const data = await performSearch(query); // Use the API function
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (url) => {
    navigate(url);
  };

  return (
    <div className="search-feature p-4">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Search for users, courses, notes, organizations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ color: 'black' }}
          className="flex-grow p-2 rounded border font-bold"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </form>

      {loading && <p className="text-gray-400 mt-2">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {results.length === 0 && !loading && !error && (
        <p className="text-gray-400 mt-2">No results found.</p>
      )}

      {results.length > 0 && (
        <div className="search-results mt-4 bg-gray-100 rounded shadow-md">
          <ul className="divide-y divide-gray-200 rounded-lg shadow-md bg-white mt-4">
            {results.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                onClick={() => handleResultClick(item.url)}
                className="p-4 hover:bg-blue-50 cursor-pointer transition duration-200"
              >
                <div className="font-semibold text-gray-800">{item.title}</div>
                {item.subtitle && (
                  <div className="text-sm text-gray-500 mt-1">{item.subtitle}</div>
                )}
                <div className="text-xs text-blue-600 uppercase mt-2">{item.type}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
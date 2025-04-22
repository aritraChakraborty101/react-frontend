import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react';

function ConnectionsList() {
  const { user, accessToken } = useAuthInfo();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Only fetch connections if userId and accessToken are available
    if (!user?.userId || !accessToken) return;

    const fetchConnections = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/connections/${user.userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { page } // pagination query parameter
          }
        );

        // If no more connections are returned, stop paginating further
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          // Append new connections to the previous list
          setConnections(prevConnections => [...prevConnections, ...response.data]);
        }
      } catch (err) {
        console.error('Error fetching connections:', err);
        setError('Failed to load connections.');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [user?.userId, accessToken, page]);

  // Memoize the list of rendered connections to optimize re-renders
  const connectionList = useMemo(() => {
    return connections.map(conn => (
      <li key={conn.id} className="mb-2">
        {conn.name} (<span className="text-sm text-gray-400">{conn.email}</span>)
      </li>
    ));
  }, [connections]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 text-gray-200">
      <h2 className="text-xl font-bold mb-4">Your Connections</h2>
      {loading && page === 1 ? (
        // Initial loading spinner; ensure you have styles for "loader"
        <div className="flex justify-center">
          <span className="loader"></span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : connections.length === 0 ? (
        <p>You have no connections.</p>
      ) : (
        <>
          <ul>{connectionList}</ul>
          {hasMore && !loading && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLoadMore}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
              >
                Load More Connections
              </button>
            </div>
          )}
          {/* Show loader when fetching additional connections */}
          {loading && page > 1 && (
            <div className="flex justify-center mt-4">
              <span className="loader"></span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ConnectionsList;

import React, { useEffect, useState } from 'react';
import { useAuthInfo } from '@propelauth/react'; // Import useAuthInfo
import { fetchReports, resolveReport } from '../api/api'; // Import the API functions

function Reports() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');
  const { accessToken } = useAuthInfo(); // Retrieve the access token

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const data = await fetchReports(accessToken); // Use the API function
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    if (accessToken) {
      fetchAllReports();
    }
  }, [accessToken]);

  const handleAction = async (reportId, action) => {
    try {
      await resolveReport(accessToken, reportId, action); // Use the API function
      setMessage(`Report ${action === 'ban' ? 'resolved (user banned)' : 'rejected'} successfully!`);
      setReports(reports.filter((report) => report.id !== reportId));
    } catch (error) {
      console.error('Error resolving report:', error);
      setMessage('Failed to resolve report.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">User Reports</h2>
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white shadow-md rounded-lg p-4 mb-4 hover:bg-gray-100 transition"
        >
          <p className="text-gray-700 mb-2">
            <strong className="font-semibold">Reported User:</strong> {report.reported_user}
          </p>
          <p className="text-gray-700 mb-2">
            <strong className="font-semibold">Reporter:</strong> {report.reporter_user}
          </p>
          <p className="text-gray-700 mb-4">
            <strong className="font-semibold">Issue:</strong> {report.issue}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleAction(report.id, 'ban')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md transition"
            >
              Ban User
            </button>
            <button
              onClick={() => handleAction(report.id, 'reject')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-md transition"
            >
              Reject Report
            </button>
          </div>
        </div>
      ))}
      {message && <p className="text-green-500 text-center mt-4">{message}</p>}
    </div>
  );
}

export default Reports;
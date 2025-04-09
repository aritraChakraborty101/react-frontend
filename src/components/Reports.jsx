import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react'; // Import useAuthInfo

function Reports() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');
  const { accessToken } = useAuthInfo(); // Retrieve the access token

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users/reports', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [accessToken]);

  const handleAction = async (reportId, action) => {
    try {
      await axios.patch(
        `http://localhost:3001/users/resolve_report/${reportId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        }
      );
      setMessage(`Report ${action === 'ban' ? 'resolved (user banned)' : 'rejected'} successfully!`);
      setReports(reports.filter((report) => report.id !== reportId));
    } catch (error) {
      console.error('Error resolving report:', error);
      setMessage('Failed to resolve report.');
    }
  };

  return (
    <div>
      <h2>User Reports</h2>
      {reports.map((report) => (
        <div key={report.id}>
          <p><strong>Reported User:</strong> {report.reported_user}</p>
          <p><strong>Reporter:</strong> {report.reporter_user}</p>
          <p><strong>Issue:</strong> {report.issue}</p>
          <button onClick={() => handleAction(report.id, 'ban')}>Ban User</button>
          <button onClick={() => handleAction(report.id, 'reject')}>Reject Report</button>
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Reports;
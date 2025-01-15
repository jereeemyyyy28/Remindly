import React, { useEffect, useState } from 'react';
import NavBar from "../../components/navBar.jsx";

const Emails = () => {
  const [emailThread, setEmailThread] = useState(''); // Store email thread content
  const [summary, setSummary] = useState(''); // Store generated summary
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track errors

  // Fetch the first email thread on component mount
  useEffect(() => {
    fetch('http://localhost:3000/emails')
      .then((response) => response.json())
      .then((data) => setEmailThread(data.thread))
      .catch((err) => setError('Failed to fetch email thread'));
  }, []);

  // Function to generate summary
  const generateSummary = () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    fetch('http://localhost:3000/emails/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threadContent: emailThread }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSummary(data.summary);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to generate summary');
        setLoading(false);
      });
  };

  return (
    <div className="p-6">
      <NavBar />
      <h1 className="text-3xl font-bold mb-4">Emails</h1>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display the email thread */}
      {emailThread ? (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">First Email Thread</h2>
          <pre className="bg-gray-800 text-white p-4 rounded border border-gray-600">{emailThread}</pre>
        </div>
      ) : (
        <p>Loading email thread...</p>
      )}

      {/* Button to generate summary */}
      <button
        onClick={generateSummary}
        disabled={loading || !emailThread}
        className={`px-4 py-2 bg-blue-500 text-white rounded ${
          loading || !emailThread ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Generating Summary...' : 'Generate Summary'}
      </button>

      {/* Display the summary */}
      {summary && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Summary</h2>
          <pre className="bg-gray-800 text-white p-4 rounded border border-gray-600">{summary}</pre>
        </div>
      )}
    </div>
  );
};

export default Emails;

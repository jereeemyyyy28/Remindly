import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from "../../components/firebaseConfig.js";
import NavBar from '../../components/navBar.jsx';

const Emails = () => {
  const [emailThread, setEmailThread] = useState(''); // Store email thread content
  const [summary, setSummary] = useState(''); // Store generated summary
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track errors

  // Fetch the first email thread from Firestore
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch('http://localhost:3000/emails');
        const data = await response.json();
        if (response.ok) {
          setEmailThread(data.thread);  // Update email thread if successful
        } else {
          setError(data.error);  // Show error if response is not successful
        }
      } catch (err) {
        console.error('Error fetching email:', err);
        setError('Failed to fetch email thread');
      }
    };

    fetchEmail();
  }, []);

  // Function to generate summary and store it in Firestore
  const generateSummary = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Send email thread to the backend for summarization
      const response = await fetch('http://localhost:3000/emails/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadContent: emailThread }), // Send the email content to summarize
      });
  
      if (response.ok) {
        const data = await response.json();
        const generatedSummary = data.summary; // Get summary from the backend response
  
        // Add summary to Firestore
        await addDoc(collection(db, 'summaries'), {
          emailId: '1', // Link summary to the email thread
          summary: generatedSummary,
          createdAt: serverTimestamp(),
        });
  
        setSummary(generatedSummary); // Update the summary in the UI
        console.log("SUMMARY: ", generatedSummary);
      } else {
        setError('Failed to generate summary');
      }
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate summary');
    } finally {
      setLoading(false);
    }
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

import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from "../../components/firebaseConfig.js";
import NavBar from '../../components/navBar.jsx';

const EmailDetails = () => {
  const { id } = useParams(); // Email ID
  const location = useLocation(); // Pass userId via state
  const userId = location.state.userId;

  const [emailThread, setEmailThread] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const emailRef = doc(db, `users/${userId}/emails`, id);
        const emailDoc = await getDoc(emailRef);

        if (emailDoc.exists()) {
          setEmailThread(emailDoc.data().thread);
        } else {
          setError('Email not found');
        }
      } catch (err) {
        console.error('Error fetching email:', err);
        setError('Failed to fetch email');
      }
    };

    fetchEmail();
  }, [id, userId]);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Send the email content to the backend for summarization
      const response = await fetch('http://localhost:3000/emails/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadContent: emailThread }), // Send email thread to summarize
      });
  
      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);  // Update summary with the generated summary from backend
      } else {
        setError('Failed to generate summary');
      }
    } catch (err) {
      console.error('Error adding summary:', err);
      setError('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <NavBar />
      <h1 className="text-3xl font-bold mb-4">Email Details</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Email Thread</h2>
        <pre className="bg-gray-800 text-white p-4 rounded">{emailThread}</pre>
      </div>

      <button
        onClick={generateSummary}
        disabled={loading}
        className={`px-4 py-2 bg-blue-500 text-white rounded ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Generating Summary...' : 'Generate Summary'}
      </button>

      {summary && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Summary</h2>
          <pre className="bg-gray-800 text-white p-4 rounded">{summary}</pre>
        </div>
      )}
    </div>
  );
};

export default EmailDetails;

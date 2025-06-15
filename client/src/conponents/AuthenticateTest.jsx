import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthenticateTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [error, setError] = useState('');

  const maxAttempts = 5;

  // Store attempts in localStorage (per testId)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('attempts')) || {};
    setAttemptCount(stored[testId] || 0);
  }, [testId]);

  const handleSubmit = async () => {
    if (attemptCount >= maxAttempts) {
      alert('You have exhausted all attempts. Redirecting to dashboard...');
      navigate('/dashboard');
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:5001/api/tests/authenticate`,
        {
          testId,
          password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Reset attempt count if successful
        const updated = JSON.parse(localStorage.getItem('attempts')) || {};
        updated[testId] = 0;
        localStorage.setItem('attempts', JSON.stringify(updated));

        navigate(`/attempt-test/${testId}`);
      } else {
        throw new Error(res.data.message || 'Invalid password');
      }
    } catch (err) {
      setError('Incorrect password');
      const updated = JSON.parse(localStorage.getItem('attempts')) || {};
      updated[testId] = (updated[testId] || 0) + 1;
      setAttemptCount(updated[testId]);
      localStorage.setItem('attempts', JSON.stringify(updated));

      if (updated[testId] >= maxAttempts) {
        alert('Maximum attempts exceeded. Redirecting...');
        navigate('/dashboard');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Authenticate to start test: {testId}</h2>
      <input
        type="password"
        placeholder="Enter Test Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSubmit} style={styles.button}>
        Start Test
      </button>
      {error && <p style={styles.error}>{error}</p>}
      <p>Attempts: {attemptCount} / {maxAttempts}</p>
    </div>
  );
};

export default AuthenticateTest;

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '500px',
    margin: 'auto',
    textAlign: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: '8px',
  },
  input: {
    padding: '0.8rem',
    width: '100%',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
};

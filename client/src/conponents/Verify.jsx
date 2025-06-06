import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Only send OTP once when the component mounts
  useEffect(() => {
    const sendVerificationOtp = async () => {
      try {
        await axios.post(
          'http://127.0.0.1:5001/api/auth/send-verify-otp',
          {},
          { withCredentials: true }
        );
        console.log('OTP sent');
      } catch (error) {
        console.error(error);
        alert('Failed to send OTP.');
      }
    };

    sendVerificationOtp();
  }, []);

  const handleVerify = async () => {
    if (!otp.trim()) {
      alert('Please enter the OTP.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://127.0.0.1:5001/api/auth/verify-account',
        { otp },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert('Account verified successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Verify Your Account</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleVerify} disabled={loading} style={styles.button}>
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  );
};

export default Verify;

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    margin: 'auto',
    gap: '1rem',
    marginTop: '100px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.8rem',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

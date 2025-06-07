import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sign = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:5001/api/auth/register',
        { name, email, password },
        { withCredentials: true }
      );

      alert(response.data.message);

      if (response.data.success) {
        navigate('/'); // Navigate to Login page
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      alert(message);
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign In / Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
        <p style={styles.loginLink}>
          Already have an account? <span onClick={() => navigate('/')} style={styles.linkText}>Login</span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center'
  },
  form: {
    display: 'inline-block',
    textAlign: 'left',
    width: '300px'
  },
  input: {
    display: 'block',
    marginBottom: '1rem',
    padding: '0.5rem',
    width: '100%'
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    width: '100%'
  },
  loginLink: {
    marginTop: '1rem',
    fontSize: '0.9rem'
  },
  linkText: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default Sign;

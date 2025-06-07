import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      alert(data.message);

      console.log("Response from server:", data);

      if (data.success) {
        console.log(JSON.stringify(data.user) + "rohan");
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
      console.error(error);
    }
  };


  return (
    <div className="login" style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
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
        <div>
          <h3 style={styles.forgot} onClick={()=>navigate('/sign-in')} >Sign In</h3>
          <p style={styles.forgot} onClick={() => navigate('/forgot-password')}>Forgot Password?</p>
        </div>
        <button type="submit" style={styles.button}>Login</button>
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
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  signIn: {
    margin: 0,
    fontSize: '1.5rem'
  },
  forgot: {
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textDecoration: 'underline'
  },
  input: {
    display: 'block',
    marginBottom: '1rem',
    padding: '0.5rem',
    width: '100%'
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Login;

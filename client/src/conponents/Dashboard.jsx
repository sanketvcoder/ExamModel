import React, { useEffect, useState } from 'react';
import Header from './Header';
import './Dashboard.css'; 
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div className="main">
      <Header />
      <div style={styles.container}>
        <div style={styles.container1}>
          {!user.isAccountVerified && (
            <button
              className="custom-button"
              onClick={() => navigate('/send-otp-mail')} // add this
            >
              Please Verify
            </button>
          )}
          {user.isProfileCreated ? (
            <button className="custom-button">Profile</button>
          ) : (
            <button className="custom-button">Create Profile</button>
          )}
        </div>
        <div style={styles.container2}>
          <h2>Welcome, {user.name}!</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '20% 80%',
    height: '90.7vh',
    marginTop: '-2px',
  },
  container1: {
    backgroundColor: '#cce6ff',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    borderRight: '1px solid #aaa',
  },
  container2: {
    padding: '2rem',
  },
  
};

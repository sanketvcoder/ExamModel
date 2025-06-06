import React, { useEffect, useState } from 'react';
import Header from './Header';
import '../css/Dashboard.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShowProfile from './ShowProfile'; // ✅ Import profile component

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false); // ✅ Track if profile should be shown
  const navigate = useNavigate();

  const updateData = async () => {
    try {
      const res = await axios.post(
        'http://127.0.0.1:5001/api/auth/is-auth',
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser); 
      } else {
        alert(res.data.message || 'Failed to update user data.');
      }
    } catch (error) {
      console.error('Error fetching updated user data:', error);
      alert('Failed to update user data.');
    }
  };

  useEffect(() => {
    updateData(); 
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
              onClick={() => navigate('/verify-account')}
            >
              Please Verify
            </button>
          )}
          {user.isProfileCreated ? (
            <button
              className="custom-button"
              onClick={() => setShowProfile(true)} // ✅ Toggle profile view
            >
              Profile
            </button>
          ) : (
            <button
              className="custom-button"
              onClick={() => navigate('/create-profile')}
            >
              Create Profile
            </button>
          )}
        </div>

        <div style={styles.container2}>
          <h2>Welcome, {user.name}!</h2>
          <main>
            {showProfile && <ShowProfile />} {/* ✅ Render profile here */}
          </main>
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
    overflowY: 'auto',
  },
};

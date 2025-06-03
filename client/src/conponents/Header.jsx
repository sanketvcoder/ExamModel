import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../global.css';
import userIMG from '../assert/user.png';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await res.json();
      console.log(data.message); // Optional: Log the response

      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed.');
    }
  };

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div className="header" style={styles.header}>
      <div className="header-1" style={styles.header1}>Dashboard</div>
      <div className="header-2" style={styles.header2}>
        <div style={styles.userInfo}>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
        <div
          style={styles.profileContainer}
          onClick={() => setShowLogout(!showLogout)}
        >
          <img
            src={userIMG}
            alt="Profile"
            style={styles.profileImg}
          />
          {showLogout && (
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'grid',
    gridTemplateColumns: '20% 80%',
    alignItems: 'center',
    borderBottom: '1px solid #ccc'
  },
  header1: {
    backgroundColor: '#cce6ff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    padding: '1rem 0'
  },
  header2: {
    backgroundColor: '#cce6ff',
    textAlign: 'right',
    paddingRight: '4rem',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem'
  },
  userInfo: {
    textAlign: 'right'
  },
  profileContainer: {
    position: 'relative',
    cursor: 'pointer'
  },
  profileImg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #007bff'
  },
  logoutBtn: {
    position: 'absolute',
    top: '50px',
    right: '0',
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 10
  }
};

export default Header;

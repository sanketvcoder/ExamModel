import React, { useEffect, useState } from 'react';
import Header from './Header';
import '../css/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShowProfile from './ShowProfile';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAssessments, setShowAssessments] = useState(false);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  // Fetch authenticated user
  const updateData = async () => {
    try {
      const res = await axios.post(
        'http://127.0.0.1:5001/api/auth/is-auth',
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;
        console.log('User Loaded:', updatedUser); // debug
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        alert(res.data.message || 'Failed to update user data.');
      }
    } catch (error) {
      console.error('Error fetching updated user data:', error.response?.data || error.message);
      alert('Failed to update user data.');
    }
  };

  // Fetch tests
  const fetchAssessments = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/tests', {
        withCredentials: true,
      });
      console.log('Fetched Tests:', res.data); // debug
      setTests(res.data);
    } catch (error) {
      console.error('Error fetching assessments:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    updateData();
  }, []);

  useEffect(() => {
    if (
      user?.role &&
      user?.isAccountVerified &&
      user?.isProfileCreated
    ) {
      fetchAssessments();
    }
  }, [user]);

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div className="main">
      <Header />
      <div style={styles.container}>
        {/* Sidebar */}
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
              onClick={() => {
                setShowProfile(true);
                setShowAssessments(false);
              }}
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

          {user.isAccountVerified && user.isProfileCreated && (
            <button
              className="custom-button"
              onClick={() => {
                setShowAssessments(true);
                setShowProfile(false);
              }}
              style={{ fontSize: '1.1rem' }}
            >
              Assessment
            </button>
          )}
        </div>

        {/* Main Content */}
        <div style={styles.container2}>
          <h2>Welcome, {user.name}!</h2>

          <main>
            {showProfile && <ShowProfile />}

            {showAssessments && (
              <div style={{ marginTop: '2rem' }}>
                <h3>Available Assessments: {tests.length}</h3>

                {tests.length === 0 && (
                  <p>No tests available for your section yet.</p>
                )}

                {/* Only for teachers */}
                {user.role === 'teacher' && (
                  <button
                    className="custom-button"
                    onClick={() => navigate('/create-test')}
                    style={{
                      fontSize: '1.5rem',
                      padding: '1rem',
                      marginTop: '1rem',
                    }}
                  >
                    ➕ Add New Test
                  </button>
                )}

                {/* Display test cards */}
                <div style={{ marginTop: '1.5rem' }}>
                  {tests.map((test, idx) => (
                    <div key={idx} style={styles.card}>
                      <p>
                        <strong>Test ID:</strong> {test.testId}
                      </p>
                      <p>
                        <strong>Sections:</strong>{' '}
                        {test.availableSections?.join(', ')}
                      </p>

                      {user.role === 'student' && (
                        <button
                          className="custom-button"
                          onClick={() => navigate(`/attend-test/${test.testId}`)}
                          style={{ marginTop: '0.5rem' }}
                        >
                          📝 Attend Test
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
  card: {
    backgroundColor: '#e7f0fd',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  },
};

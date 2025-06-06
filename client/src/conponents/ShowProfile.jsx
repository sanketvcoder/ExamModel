import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ShowProfile.css';

const ShowProfile = () => {
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const showData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/profile/get-profile', {
        withCredentials: true
      });
      setProfile(res.data.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setRole(user.role);
    showData();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div className="profile-container">
      <h2>{role === 'teacher' ? profile.fullName : profile.contact}'s Profile</h2>

      {role === 'teacher' ? (
        <>
          <p><strong>Email:</strong> {profile.teacherId?.email}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>DOB:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Phone:</strong> {profile.phoneNumber}</p>
          <p><strong>Qualification:</strong> {profile.qualification}</p>
          <p><strong>Experience:</strong> {profile.experience}</p>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Address:</strong> {`${profile.address.street}, ${profile.address.city}, ${profile.address.state} - ${profile.address.postalCode}`}</p>
          <p><strong>LinkedIn:</strong> <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">{profile.socialLinks.linkedin}</a></p>
          <p><strong>GitHub:</strong> <a href={profile.socialLinks.github} target="_blank" rel="noreferrer">{profile.socialLinks.github}</a></p>
        </>
      ) : (
        <>
          <p><strong>Contact:</strong> {profile.contact}</p>
          <p><strong>Section:</strong> {profile.section}</p>
          <p><strong>DOB:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Qualification:</strong> {profile.qualification}</p>
          <p><strong>Year of Study:</strong> {profile.yearOfStudy}</p>
          <p><strong>Specialization:</strong> {profile.specialization}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Address:</strong> {`${profile.street}, ${profile.city}, ${profile.state} - ${profile.postalCode}`}</p>
          <p><strong>LinkedIn:</strong> <a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin}</a></p>
          <p><strong>GitHub:</strong> <a href={profile.github} target="_blank" rel="noreferrer">{profile.github}</a></p>
        </>
      )}
    </div>
  );
};

export default ShowProfile;

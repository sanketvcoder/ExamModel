import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // used for redirection
import '../css/CreateProfile.css';

const CreateProfile = () => {
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setRole(user.role);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://127.0.0.1:5001/profile/create-profile';
      await axios.post(url, formData, { withCredentials: true });
      alert('Profile created successfully!');
      navigate('/dashboard'); // ✅ Redirect after alert
    } catch (err) {
      console.error(err);
      alert('Profile creation failed.');
    }
  };

  if (!role) return <p className="loading-text">Loading role...</p>;

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>Create {role === 'teacher' ? 'Teacher' : 'Student'} Profile</h2>

      {role === 'teacher' ? (
        <>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <select name="gender" onChange={handleChange} required defaultValue="">
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="date" name="dateOfBirth" onChange={handleChange} required />
          <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
          <input name="qualification" placeholder="Qualification" onChange={handleChange} required />
          <input name="experience" placeholder="Experience" onChange={handleChange} required />
          <input name="specialization" placeholder="Specialization" onChange={handleChange} required />
          <textarea name="bio" placeholder="Bio" onChange={handleChange} />
          <input name="street" placeholder="Street" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />
          <input name="state" placeholder="State" onChange={handleChange} />
          <input name="postalCode" placeholder="Postal Code" onChange={handleChange} />
          <input name="linkedin" placeholder="LinkedIn" onChange={handleChange} />
          <input name="github" placeholder="GitHub" onChange={handleChange} />
        </>
      ) : (
        <>
          <input name="contact" placeholder="Contact" onChange={handleChange} required />
          <input name="section" placeholder="Section" onChange={handleChange} required />
          <input type="date" name="dateOfBirth" onChange={handleChange} required />
          <input name="qualification" placeholder="Qualification" onChange={handleChange} required />
          <input name="yearOfStudy" placeholder="Year of Study" onChange={handleChange} required />
          <input name="specialization" placeholder="Specialization" onChange={handleChange} required />
          <textarea name="bio" placeholder="Bio" onChange={handleChange} required />
          <input name="street" placeholder="Street" onChange={handleChange} required />
          <input name="city" placeholder="City" onChange={handleChange} required />
          <input name="state" placeholder="State" onChange={handleChange} required />
          <input name="postalCode" placeholder="Postal Code" onChange={handleChange} required />
          <input name="linkedin" placeholder="LinkedIn" onChange={handleChange} required />
          <input name="github" placeholder="GitHub" onChange={handleChange} required />
        </>
      )}
      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateProfile;

import express from 'express';
import { dynamicProfile, getDynamicProfile, updateDynamicProfile } from '../../controller/profileController/dynamicProfile.js';
import userAuth from '../../middleware/userAuth.js';
import checkVerification from '../../middleware/checkVerification.js';
import { verifyEmailPassword } from '../../utils/verifyEmailPassword.js';

const teacherProfileRoutes = express.Router();

// Route to create a profile dynamically based on user role (teacher or student)
teacherProfileRoutes.post('/create-profile', userAuth, dynamicProfile);

// Route to get a profile dynamically based on user role (teacher or student)
teacherProfileRoutes.get('/get-profile', userAuth, getDynamicProfile);

// Route to verify the profile before updating
teacherProfileRoutes.post('/verify-profile-before-update', verifyEmailPassword);

// Route to update a profile dynamically based on user role (teacher or student)
teacherProfileRoutes.put('/update-profile', userAuth, checkVerification, updateDynamicProfile);

export default teacherProfileRoutes;

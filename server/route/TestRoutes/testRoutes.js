// routes/assessmentRoutes/testRoutes.js
import express from 'express';
import userAuth from '../../middleware/userAuth.js';
import { createTest, deleteTest, getTestById, getTests, testAuth, updateTestSections } from '../../controller/testController/testController.js';
import { addQuestion, deleteQuestion, updateQuestion } from '../../controller/testController/CurdQuestion.js';

// Ensure only authenticated users (teachers) can access

const router = express.Router();

// Route for teacher to create a test
router.post('/create', userAuth, createTest);

// Route to get all tests (for admin/teacher view)
router.get('/', userAuth, getTests);

// Route to update test sections (where the test is available)
router.put('/update-sections', userAuth, updateTestSections);

// Route to delete a test (by createdBy and testId)
router.delete('/delete/:testId', userAuth, deleteTest);


// from here the question curd is present

//Add Question to test
router.post('/:testId/questions',userAuth,addQuestion)

// Update question by index
router.put('/:testId/question/:questionIndex', userAuth, updateQuestion);

// Delete question by index
router.delete('/:testId/question/:questionIndex', userAuth, deleteQuestion);

router.post('/tests/authenticate',testAuth)

router.get('/:testId', userAuth, getTestById);


export default router;

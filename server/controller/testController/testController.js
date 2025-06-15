// controller/assessmentController/testController.js
import Test from '../../models/testModel.js';
import userModel from '../../models/userModel.js';
import Profile from '../../models/studentProfileModels.js'

// Create a new test
export const createTest = async (req, res) => {
  const createdBy = req.userId;
  const { testId, testPassword, availableSections } = req.body;

  if (!createdBy) {
    return res.status(400).json({ message: 'Please provide createdBy' });
  }

  if (!testId || !testPassword || !availableSections) {
    return res.status(400).json({ message: 'Please provide all the required fields.' });
  }

  try {
    const newTest = new Test({
      testId,
      testPassword,
      createdBy,
      availableSections,
    });

    await newTest.save();
    return res.status(201).json({ message: 'Test created successfully!', test: newTest });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating the test',
      error: error.message || error,
    });
  }
};

// Get tests created by logged-in user
export const getTests = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'teacher') {
      const tests = await Test.find({ createdBy: userId });
      return res.status(200).json(tests);
    }

    if (user.role === 'student') {
      const profile = await Profile.findOne({ userId: userId });

      if (!profile || !profile.section) {
        return res.status(400).json({ message: 'Student profile or section not found.' });
      }

      const section = profile.section;

      const tests = await Test.find({ availableSections: { $in: [section] } });

      return res.status(200).json(tests);
    }

    return res.status(403).json({ message: 'Invalid user role.' });

  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching tests',
      error: error.message,
    });
  }
};


// Update available sections of a test
export const updateTestSections = async (req, res) => {
  const { testId, availableSections } = req.body;

  if (!testId || !availableSections) {
    return res.status(400).json({ message: 'Please provide testId and availableSections.' });
  }

  try {
    const test = await Test.findOneAndUpdate(
      { testId },
      { availableSections },
      { new: true }
    );
    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    return res.status(200).json({ message: 'Test sections updated successfully!', test });
  } catch (error) {
    return res.status(500).json({
      message: 'Error in updating the test',
      error: error.message || error,
    });
  }
};

// Delete a test created by the logged-in user
export const deleteTest = async (req, res) => {
  const { testId } = req.params;
  const createdBy = req.userId;

  try {
    const test = await Test.findOneAndDelete({ testId, createdBy });
    if (!test) {
      return res.status(404).json({ message: 'Test not found or you are not authorized to delete this test.' });
    }

    return res.status(200).json({ message: 'Test deleted successfully', test });
  } catch (error) {
    return res.status(500).json({
      message: 'Error in deleting the test',
      error: error.message || error,
    });
  }
};

// Authenticate test access for students
export const testAuth = async (req, res) => {
  const { testId, testPassword } = req.body;

  if (!testId || !testPassword) {
    return res.status(400).json({ message: 'Please provide testId and testPassword.' });
  }

  try {
    const test = await Test.findOne({ testId });

    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    if (test.testPassword !== testPassword) {
      return res.status(401).json({ message: 'Invalid test password.' });
    }

    return res.status(200).json({ message: 'Test authentication successful.' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during test authentication.',
      error: error.message || error,
    });
  }
  
};
export const getTestById = async (req, res) => {
  const { testId } = req.params;
  const createdBy = req.userId;

  try {
    const test = await Test.findOne({ testId, createdBy });
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found or unauthorized" });
    }
    return res.status(200).json({ success: true, test });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Error: ${error.message}` });
  }
};


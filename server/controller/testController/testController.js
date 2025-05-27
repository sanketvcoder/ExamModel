// controller/assessmentController/testController.js
import Test from '../../models/testModel.js';

// Function to create a new test
export const createTest = async (req, res) => {
    const createdBy = req.userId;
  const { testId, testPassword, availableSections } = req.body;

  // Check if all required fields are provided
  if(!createdBy){
    return res.status(400).json({ message: 'Please provide createdBy' });
  }
        if (!testId || !testPassword || !availableSections || !createdBy) {
    return res.status(400).json({ message: 'Please provide all the required fields.' });
  }

  try {
    // Create new test
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
        error: error.message || error 
      });
  }
};

// Function to retrieve tests
export const getTests = async (req, res) => {
    const userId = req.userId;
  try {
    const tests = await Test.find({ createdBy: userId });
    return res.status(200).json(tests);
  } catch (error) {
    return res.status(500).json({ 
        message: 'Error in retriving the test', 
        error: error.message || error 
      });
  }
};

// Function to update test availability (sections)
export const updateTestSections = async (req, res) => {
  const { testId, availableSections } = req.body;

  if (!testId || !availableSections) {
    return res.status(400).json({ message: 'Please provide testId and availableSections.' });
  }

  try {
    const test = await Test.findOneAndUpdate({ testId }, { availableSections }, { new: true });
    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }
    return res.status(200).json({ message: 'Test sections updated successfully!', test });
  } catch (error) {
    return res.status(500).json({ 
        message: 'Error in updating the test', 
        error: error.message || error 
      });
  }
};

export const deleteTest = async(req,res)=>{
    const {testId} = req.params
    const createdBy = req.userId

    try {
        const test = await Test.findOneAndDelete({testId,createdBy})
        if (!test) {
            return res.status(404).json({ message: 'Test not found or you are not authorized to delete this test.' });
        }

        return res.status(200).json({ message: 'Test deleted successfully', test });

    } catch (error) {
        return res.status(500).json({ 
            message: 'Error in deleting the test', 
            error: error.message || error 
          });
    }
}

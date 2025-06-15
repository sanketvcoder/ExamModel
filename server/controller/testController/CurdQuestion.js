import Test from "../../models/testModel.js";

// ADD a new question to a test
export const addQuestion = async (req, res) => {
  const { testId } = req.params;
  const createdBy = req.userId;
  const { questionText, options, correctAnswer, marks } = req.body;

  if (!questionText || !Array.isArray(options) || options.length < 2 || !correctAnswer || marks === undefined) {
    return res.status(400).json({
      success: false,
      message: "All fields are required and options must be at least 2.",
    });
  }

  try {
    const test = await Test.findOne({ testId, createdBy });
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found or unauthorized.",
      });
    }

    const newQuestion = { questionText, options, correctAnswer, marks };
    test.questions.push(newQuestion);
    await test.save();

    return res.status(200).json({
      success: true,
      message: "Question added successfully.",
      questions: test.questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

// UPDATE a question in a test
export const updateQuestion = async (req, res) => {
  const { testId, questionIndex } = req.params;
  const createdBy = req.userId;
  const { questionText, options, correctAnswer, marks } = req.body;

  // Validate that questionIndex is a valid integer >= 0
  const qIndex = parseInt(questionIndex, 10);
  if (isNaN(qIndex) || qIndex < 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid question index.",
    });
  }

  // Validate at least one field is provided
  if (
    questionText === undefined &&
    options === undefined &&
    correctAnswer === undefined &&
    marks === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided to update.",
    });
  }

  // If options provided, validate it's an array with min 2 options
  if (options !== undefined) {
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Options must be an array with at least 2 elements.",
      });
    }
  }

  // If marks provided, validate it's a positive number
  if (marks !== undefined) {
    if (typeof marks !== "number" || marks < 0) {
      return res.status(400).json({
        success: false,
        message: "Marks must be a non-negative number.",
      });
    }
  }

  // If correctAnswer provided, validate it exists in options (if options also provided)
  if (correctAnswer !== undefined && options !== undefined) {
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be one of the options.",
      });
    }
  }

  try {
    const test = await Test.findOne({ testId, createdBy });
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found or unauthorized.",
      });
    }

    if (!test.questions[qIndex]) {
      return res.status(404).json({
        success: false,
        message: "Question not found at the given index.",
      });
    }

    // Update fields only if they are provided
    if (questionText !== undefined) test.questions[qIndex].questionText = questionText;
    if (options !== undefined) test.questions[qIndex].options = options;
    if (correctAnswer !== undefined) test.questions[qIndex].correctAnswer = correctAnswer;
    if (marks !== undefined) test.questions[qIndex].marks = marks;

    await test.save();

    return res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      question: test.questions[qIndex],
      totalQuestions: test.questions.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// DELETE a question from a test
export const deleteQuestion = async (req, res) => {
  const { testId, questionIndex } = req.params;
  const createdBy = req.userId;

  try {
    const test = await Test.findOne({ testId, createdBy });
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found or unauthorized.",
      });
    }

    if (questionIndex < 0 || questionIndex >= test.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index.",
      });
    }

    test.questions.splice(questionIndex, 1); // Remove question
    await test.save();

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
      remainingQuestions: test.questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

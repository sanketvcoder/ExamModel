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

  if (!questionText && !options && !correctAnswer && marks === undefined) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided to update.",
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

    if (!test.questions[questionIndex]) {
      return res.status(404).json({
        success: false,
        message: "Question not found at the given index.",
      });
    }

    if (questionText) test.questions[questionIndex].questionText = questionText;
    if (Array.isArray(options)) test.questions[questionIndex].options = options;
    if (correctAnswer) test.questions[questionIndex].correctAnswer = correctAnswer;
    if (marks !== undefined) test.questions[questionIndex].marks = marks;

    await test.save();

    return res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      question: test.questions[questionIndex],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
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

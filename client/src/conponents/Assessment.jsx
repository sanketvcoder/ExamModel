import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuestionInput = ({ question, index, onQuestionChange, onOptionChange, onOptionCountChange }) => {
  return (
    <div style={styles.questionBlock}>
      <input
        placeholder="Question Text"
        value={question.questionText}
        onChange={(e) => onQuestionChange(index, 'questionText', e.target.value)}
      />
      <input
        type="number"
        min={0}
        placeholder="Number of options"
        value={question.optionCount}
        onChange={(e) => onOptionCountChange(index, e.target.value)}
      />
      {question.options.map((option, oIndex) => (
        <input
          key={oIndex}
          placeholder={`Option ${oIndex + 1}`}
          value={option}
          onChange={(e) => onOptionChange(index, oIndex, e.target.value)}
        />
      ))}
      <input
        placeholder="Correct Answer (must match one option)"
        value={question.correctAnswer}
        onChange={(e) => onQuestionChange(index, 'correctAnswer', e.target.value)}
      />
    </div>
  );
};

const Assessment = () => {
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [testId, setTestId] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [availableSections, setAvailableSections] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.isAccountVerified || !userData.isProfileCreated) {
      setUser(null);
      return;
    }
    setUser(userData);
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5001/api/tests', { withCredentials: true });
      setTests(res.data);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: [],
        correctAnswer: '',
        optionCount: 0,
      },
    ]);
  };

  const handleOptionCountChange = (qIndex, count) => {
    const parsedCount = parseInt(count);
    if (isNaN(parsedCount) || parsedCount < 0) return;

    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].optionCount = parsedCount;

      // Adjust options array length
      if (updated[qIndex].options.length > parsedCount) {
        updated[qIndex].options = updated[qIndex].options.slice(0, parsedCount);
      } else {
        updated[qIndex].options = [
          ...updated[qIndex].options,
          ...Array(parsedCount - updated[qIndex].options.length).fill(''),
        ];
      }
      return updated;
    });
  };

  const handleQuestionChange = (qIndex, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex][field] = value;
      return updated;
    });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].options[oIndex] = value;
      return updated;
    });
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const { questionText, options, correctAnswer } = questions[i];

      if (!questionText.trim()) {
        alert(`❌ Question text cannot be empty at question #${i + 1}`);
        return false;
      }

      if (questions.filter(q => q.questionText === questionText).length > 1) {
        alert(`❌ Duplicate question text found: "${questionText}"`);
        return false;
      }

      if (options.length === 0 || options.some(opt => !opt.trim())) {
        alert(`❌ All options must be non-empty for question "${questionText}"`);
        return false;
      }

      if (!options.includes(correctAnswer)) {
        alert(`❌ Correct answer for "${questionText}" must be one of the options`);
        return false;
      }
    }
    return true;
  };

  const handleCreateTest = async () => {
    if (!testId.trim()) {
      alert('❌ Test ID cannot be empty');
      return;
    }
    if (!testPassword.trim()) {
      alert('❌ Test Password cannot be empty');
      return;
    }
    if (!availableSections.trim()) {
      alert('❌ Available Sections cannot be empty');
      return;
    }
    if (questions.length === 0) {
      alert('❌ Please add at least one question');
      return;
    }
    if (!validateQuestions()) return;

    try {
      await axios.post(
        'http://127.0.0.1:5001/api/tests/create',
        {
          testId,
          testPassword,
          availableSections: availableSections.split(',').map(s => s.trim()),
        },
        { withCredentials: true }
      );

      for (let q of questions) {
        await axios.post(
          `http://127.0.0.1:5001/api/tests/${testId}/questions`,
          {
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            marks: 1,
          },
          { withCredentials: true }
        );
      }

      alert('✅ Test created successfully!');
      fetchTests();
      setQuestions([]);
      setTestId('');
      setTestPassword('');
      setAvailableSections('');
    } catch (error) {
      console.error('Error creating test:', error);
      alert('❌ Failed to create test');
    }
  };

  const handleAttemptTest = async (testId) => {
    const attempts = JSON.parse(localStorage.getItem('testAttempts')) || {};
    const attemptCount = attempts[testId] || 0;

    if (attemptCount >= 5) {
      alert('❌ You have reached the maximum attempt limit for this test.');
      return;
    }

    const password = prompt('Enter test password:');
    if (!password) return;

    try {
      await axios.post('http://127.0.0.1:5001/api/tests/auth', {
        testId,
        testPassword: password,
      });

      localStorage.setItem(
        'testAttempts',
        JSON.stringify({
          ...attempts,
          [testId]: attemptCount + 1,
        })
      );

      navigate(`/attempt-test/${testId}`);
    } catch (error) {
      alert('❌ Incorrect password or test not found');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm(`Are you sure you want to delete test "${testId}"? This action cannot be undone.`))
      return;

    try {
      await axios.delete(`http://127.0.0.1:5001/api/tests/delete/${testId}`, { withCredentials: true });
      alert(`✅ Test "${testId}" deleted successfully.`);
      fetchTests();
    } catch (error) {
      console.error('Failed to delete test:', error);
      alert('❌ Failed to delete test');
    }
  };

  if (!user) return <p>Unauthorized or Profile not verified.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Assessments</h2>

      {user.role === 'teacher' && (
        <>
          <h3>Create a New Test</h3>
          <div style={styles.card}>
            <input
              placeholder="Test ID"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
            />
            <input
              placeholder="Test Password"
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
            />
            <input
              placeholder="Available Sections (comma-separated)"
              value={availableSections}
              onChange={(e) => setAvailableSections(e.target.value)}
            />
            <button onClick={handleAddQuestion}>Add Question</button>

            {questions.map((q, idx) => (
              <QuestionInput
                key={idx}
                question={q}
                index={idx}
                onQuestionChange={handleQuestionChange}
                onOptionChange={handleOptionChange}
                onOptionCountChange={handleOptionCountChange}
              />
            ))}

            <button
              onClick={handleCreateTest}
              disabled={
                !testId.trim() ||
                !testPassword.trim() ||
                !availableSections.trim() ||
                questions.length === 0
              }
            >
              Create Test
            </button>
          </div>

          <h3>All Tests</h3>
          {tests.length === 0 && <p>No tests available</p>}
          {tests.map((test, index) => (
            <div key={index} style={styles.card}>
              <p><strong>ID:</strong> {test.testId}</p>
              <p><strong>Sections:</strong> {test.availableSections.join(', ')}</p>
              <button onClick={() => navigate(`/edit-test/${test.testId}`)} className="custom-button">
                Edit
              </button>
              <button onClick={() => navigate(`/leaderboard/${test.testId}`)} className="custom-button">
                Leaderboard
              </button>
              <button
                onClick={() => handleDeleteTest(test.testId)}
                className="custom-button danger"
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}

      {user.role === 'student' && (
        <>
          <h3>Available Tests</h3>
          {tests.map((test, index) => (
            <div key={index} style={styles.card}>
              <p><strong>ID:</strong> {test.testId}</p>
              <button onClick={() => handleAttemptTest(test.testId)} className="custom-button">
                Attempt
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Assessment;

const styles = {
  card: {
    backgroundColor: '#f0f8ff',
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  questionBlock: {
    marginTop: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#e6f2ff',
    borderRadius: '8px',
  },
};

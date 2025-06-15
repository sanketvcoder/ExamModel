import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditQuestions = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`/api/test/${testId}`);
        setQuestions(res.data.test.questions);
      } catch (error) {
        alert('Failed to load test questions');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (let i = 0; i < questions.length; i++) {
        await axios.put(`/api/test/${testId}/question/${i}`, questions[i]);
      }

      alert('All questions updated successfully!');
      navigate('/create-test');
    } catch (error) {
      console.error(error);
      alert('Failed to update questions.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Questions</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question, qIndex) => (
          <div key={qIndex} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <label>
              Question Text:
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              />
            </label>
            <br />
            <label>Options:</label>
            {question.options.map((opt, oIndex) => (
              <div key={oIndex}>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                />
              </div>
            ))}
            <br />
            <label>
              Correct Answer:
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
              />
            </label>
            <br />
            <label>
              Marks:
              <input
                type="number"
                value={question.marks}
                onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value))}
              />
            </label>
          </div>
        ))}
        <button type="submit">Update Questions</button>
      </form>
    </div>
  );
};

export default EditQuestions;

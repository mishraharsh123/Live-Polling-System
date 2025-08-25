import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearError } from '../store/pollSlice';
import socketService from '../services/socketService';

const CreatePollForm = ({ canCreate }) => {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!canCreate) {
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (question.trim() && validOptions.length >= 2) {
      const pollData = {
        question: question.trim(),
        options: validOptions,
        timeLimit: parseInt(timeLimit)
      };
      
      socketService.createPoll(pollData);
      
      // Reset form
      setQuestion('');
      setOptions(['', '']);
      setTimeLimit(60);
      dispatch(clearError());
    }
  };

  return (
    <div className="create-poll-form">
      <h3>Create New Poll</h3>
      
      {!canCreate && (
        <div className="error-message">
          Cannot create a new poll while students are still answering the current question.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question"
            required
            disabled={!canCreate}
          />
        </div>

        <div className="form-group">
          <label>Time Limit (seconds):</label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            min="10"
            max="300"
            disabled={!canCreate}
          />
        </div>

        <div className="options-container">
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required={index < 2}
                disabled={!canCreate}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="btn btn-secondary btn-small"
                  disabled={!canCreate}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          {options.length < 6 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="btn btn-secondary btn-small"
              disabled={!canCreate}
            >
              Add Option
            </button>
          )}
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={!canCreate || !question.trim() || options.filter(opt => opt.trim()).length < 2}
        >
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePollForm;

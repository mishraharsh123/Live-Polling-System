import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedOption, setHasAnswered, setTimeRemaining } from '../store/pollSlice';
import socketService from '../services/socketService';
import PollResults from './PollResults';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { 
    studentName, 
    studentId, 
    currentPoll, 
    pollResults, 
    hasAnswered, 
    selectedOption,
    timeRemaining 
  } = useSelector(state => state.poll);
  
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (currentPoll && currentPoll.isActive && !hasAnswered) {
      // Start countdown timer
      let timeLeft = currentPoll.timeLimit || 60;
      dispatch(setTimeRemaining(timeLeft));
      
      const interval = setInterval(() => {
        timeLeft -= 1;
        dispatch(setTimeRemaining(timeLeft));
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          // Auto-submit or show results when time runs out
        }
      }, 1000);
      
      setTimer(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    }
  }, [currentPoll, hasAnswered, dispatch, timer]);

  const handleOptionSelect = (optionId) => {
    if (!hasAnswered && currentPoll && currentPoll.isActive) {
      dispatch(setSelectedOption(optionId));
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption && !hasAnswered) {
      socketService.submitAnswer({
        studentId,
        optionId: selectedOption
      });
      dispatch(setHasAnswered(true));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="student-dashboard">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Welcome, {studentName}!</h2>
      </div>

      {!currentPoll ? (
        <div className="poll-container">
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            Waiting for teacher to start a poll...
          </p>
        </div>
      ) : (
        <>
          {currentPoll.isActive && !hasAnswered ? (
            <div className="poll-container">
              <div className="poll-question">{currentPoll.question}</div>
              
              {timeRemaining > 0 && (
                <div className="timer">
                  Time remaining: {formatTime(timeRemaining)}
                </div>
              )}
              
              <div className="poll-options">
                {currentPoll.options.map(option => (
                  <div
                    key={option.id}
                    className={`poll-option ${selectedOption === option.id ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <input
                      type="radio"
                      name="pollOption"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => handleOptionSelect(option.id)}
                    />
                    <span>{option.text}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                  className="btn"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption || timeRemaining <= 0}
                >
                  Submit Answer
                </button>
              </div>
            </div>
          ) : hasAnswered || !currentPoll.isActive ? (
            <div>
              <div className="success-message">
                {hasAnswered ? 'Thank you for your response!' : 'Poll has ended'}
              </div>
              
              {Object.keys(pollResults).length > 0 && (
                <PollResults 
                  poll={currentPoll} 
                  results={pollResults} 
                  title="Poll Results"
                />
              )}
            </div>
          ) : (
            <div className="poll-container">
              <div className="timer" style={{ color: '#e74c3c' }}>
                Time's up!
              </div>
              <p style={{ textAlign: 'center', color: '#666' }}>
                Waiting for results...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDashboard;

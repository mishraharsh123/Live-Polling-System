import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../store/pollSlice';
import socketService from '../services/socketService';
import CreatePollForm from './CreatePollForm';
import PollResults from './PollResults';
import StudentsList from './StudentsList';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { currentPoll, students, pollResults } = useSelector(state => state.poll);
  const [pastPolls, setPastPolls] = useState([]);

 useEffect(() => {
  socketService.joinAsTeacher();

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  // Fetch past polls
  fetch(`${API_BASE_URL}/api/past-polls`)
    .then(res => res.json())
    .then(data => setPastPolls(data))
    .catch(err => console.error('Error fetching past polls:', err));

  return () => {
    dispatch(clearError());
  };
}, [dispatch]);

  const canCreateNewPoll = () => {
    if (!currentPoll) return true;
    if (!currentPoll.isActive) return true;
    return students.every(student => student.hasAnswered);
  };

  return (
    <div className="teacher-dashboard">
      <h2>Teacher Dashboard</h2>
      
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <CreatePollForm canCreate={canCreateNewPoll()} />
          
          {currentPoll && (
            <div className="poll-container">
              <h3>Current Poll</h3>
              <div className="poll-question">{currentPoll.question}</div>
              <div className="poll-options">
                {currentPoll.options.map(option => (
                  <div key={option.id} className="poll-option">
                    {option.text}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Status: {currentPoll.isActive ? 'Active' : 'Ended'}
              </div>
            </div>
          )}
        </div>

        <div>
          <StudentsList />
          
          {currentPoll && Object.keys(pollResults).length > 0 && (
            <PollResults 
              poll={currentPoll} 
              results={pollResults} 
              title="Live Results"
            />
          )}
        </div>
      </div>

      {pastPolls.length > 0 && (
        <div className="past-polls" style={{ marginTop: '2rem' }}>
          <h3>Past Polls</h3>
          {pastPolls.slice(-3).reverse().map(poll => (
            <PollResults 
              key={poll.id}
              poll={poll} 
              results={poll.results} 
              title={`Poll: ${poll.question}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;

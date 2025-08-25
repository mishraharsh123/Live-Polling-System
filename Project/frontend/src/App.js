import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketService from './services/socketService';
import RoleSelection from './components/RoleSelection';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentNameForm from './components/StudentNameForm';
import ChatPopup from './components/ChatPopup';
import {
  setCurrentPoll,
  setPollResults,
  setStudents,
  setIsConnected,
  setError,
  setHasAnswered,
  resetPoll
} from './store/pollSlice';

function App() {
  const dispatch = useDispatch();
  const { userRole, studentName, isConnected, error } = useSelector(state => state.poll);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Connect to socket server
    socketService.connect();

    // Set up socket event listeners
    socketService.on('connected', (connected) => {
      dispatch(setIsConnected(connected));
    });

    socketService.on('current-poll', (poll) => {
      dispatch(setCurrentPoll(poll));
    });

    socketService.on('new-poll', (poll) => {
      dispatch(setCurrentPoll(poll));
      dispatch(setHasAnswered(false));
    });

    socketService.on('poll-results', (results) => {
      dispatch(setPollResults(results));
    });

    socketService.on('poll-ended', (data) => {
      dispatch(setPollResults(data.results));
    });

    socketService.on('students-list', (students) => {
      dispatch(setStudents(students));
    });

    socketService.on('poll-creation-error', (error) => {
      dispatch(setError(error));
    });

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  const renderContent = () => {
    if (!userRole) {
      return <RoleSelection />;
    }

    if (userRole === 'student' && !studentName) {
      return <StudentNameForm />;
    }

    if (userRole === 'teacher') {
      return <TeacherDashboard />;
    }

    if (userRole === 'student') {
      return <StudentDashboard />;
    }

    return null;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Live Polling System</h1>
        {!isConnected && (
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Connecting to server...
          </div>
        )}
      </header>
      
      <main className="main-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        {renderContent()}
      </main>

      {/* Chat toggle button - only show when user has selected a role */}
      {userRole && (
        <button 
          className="chat-toggle-btn"
          onClick={() => setIsChatOpen(true)}
          title="Open Chat"
        >
          💬
        </button>
      )}

      {/* Chat popup */}
      <ChatPopup 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}

export default App;

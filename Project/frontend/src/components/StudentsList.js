import React from 'react';
import { useSelector } from 'react-redux';

const StudentsList = () => {
  const { students, currentPoll } = useSelector(state => state.poll);

  return (
    <div className="students-list">
      <h3>Connected Students ({students.length})</h3>
      
      {students.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No students connected yet
        </p>
      ) : (
        <div>
          {students.map(student => (
            <div key={student.id} className="student-item">
              <span>{student.name}</span>
              {currentPoll && currentPoll.isActive && (
                <span 
                  className={`student-status ${student.hasAnswered ? 'answered' : 'pending'}`}
                >
                  {student.hasAnswered ? 'Answered' : 'Pending'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentsList;

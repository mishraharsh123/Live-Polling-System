import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { setStudentInfo } from '../store/pollSlice';
import socketService from '../services/socketService';

const StudentNameForm = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const studentId = uuidv4();
      dispatch(setStudentInfo({ name: name.trim(), id: studentId }));
      socketService.joinAsStudent({ studentId, name: name.trim() });
    }
  };

  return (
    <div className="student-name-form">
      <h3>Enter Your Name</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentName">Your Name:</label>
          <input
            type="text"
            id="studentName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <button type="submit" className="btn" disabled={!name.trim()}>
          Join Poll
        </button>
      </form>
    </div>
  );
};

export default StudentNameForm;

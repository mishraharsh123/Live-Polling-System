import React from 'react';
import { useDispatch } from 'react-redux';
import { setUserRole } from '../store/pollSlice';

const RoleSelection = () => {
  const dispatch = useDispatch();

  const handleRoleSelect = (role) => {
    dispatch(setUserRole(role));
  };

  return (
    <div className="role-selection">
      <h2>Choose Your Role</h2>
      <div className="role-buttons">
        <div 
          className="role-button"
          onClick={() => handleRoleSelect('teacher')}
        >
          <h3>Teacher</h3>
          <p>Create polls and view results</p>
        </div>
        <div 
          className="role-button"
          onClick={() => handleRoleSelect('student')}
        >
          <h3>Student</h3>
          <p>Answer polls and see results</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;

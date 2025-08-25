import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userRole: null, // 'teacher' or 'student'
  studentName: '',
  studentId: null,
  currentPoll: null,
  pollResults: {},
  students: [],
  timeRemaining: 0,
  hasAnswered: false,
  selectedOption: null,
  pastPolls: [],
  isConnected: false,
  error: null,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    setStudentInfo: (state, action) => {
      state.studentName = action.payload.name;
      state.studentId = action.payload.id;
    },
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.hasAnswered = false;
      state.selectedOption = null;
      if (action.payload) {
        state.timeRemaining = action.payload.timeLimit || 60;
      }
    },
    setPollResults: (state, action) => {
      state.pollResults = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setPastPolls: (state, action) => {
      state.pastPolls = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPoll: (state) => {
      state.currentPoll = null;
      state.pollResults = {};
      state.timeRemaining = 0;
      state.hasAnswered = false;
      state.selectedOption = null;
    },
  },
});

export const {
  setUserRole,
  setStudentInfo,
  setCurrentPoll,
  setPollResults,
  setStudents,
  setTimeRemaining,
  setHasAnswered,
  setSelectedOption,
  setPastPolls,
  setIsConnected,
  setError,
  clearError,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;

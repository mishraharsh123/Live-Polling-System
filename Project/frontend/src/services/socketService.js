import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  connect(serverUrl = "https://live-polling-system-6drf.onrender.com/") {
    this.socket = io(serverUrl);
    
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.emit('connected', true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.emit('connected', false);
    });

    // Poll events
    this.socket.on('current-poll', (poll) => {
      this.emit('current-poll', poll);
    });

    this.socket.on('new-poll', (poll) => {
      this.emit('new-poll', poll);
    });

    this.socket.on('poll-results', (results) => {
      this.emit('poll-results', results);
    });

    this.socket.on('poll-ended', (data) => {
      this.emit('poll-ended', data);
    });

    this.socket.on('students-list', (students) => {
      this.emit('students-list', students);
    });

    this.socket.on('poll-creation-error', (error) => {
      this.emit('poll-creation-error', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Teacher methods
  joinAsTeacher() {
    if (this.socket) {
      this.socket.emit('join-teacher');
    }
  }

  createPoll(pollData) {
    if (this.socket) {
      this.socket.emit('create-poll', pollData);
    }
  }

  // Student methods
  joinAsStudent(studentData) {
    if (this.socket) {
      this.socket.emit('join-student', studentData);
    }
  }

  submitAnswer(answerData) {
    if (this.socket) {
      this.socket.emit('submit-answer', answerData);
    }
  }

  // Event handling
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }
}

const socketService = new SocketService();
export default socketService;

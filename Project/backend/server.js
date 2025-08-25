const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage
let currentPoll = null;
let students = new Map(); // studentId -> { name, socketId, hasAnswered }
let pollResults = new Map(); // optionId -> count
let pastPolls = [];
let chatMessages = []; // Store chat messages

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Teacher joins
  socket.on('join-teacher', () => {
    socket.join('teachers');
    socket.emit('current-poll', currentPoll);
    socket.emit('students-list', Array.from(students.values()));
    if (currentPoll) {
      socket.emit('poll-results', Object.fromEntries(pollResults));
    }
  });

  // Student joins
  socket.on('join-student', (data) => {
    const { studentId, name } = data;
    students.set(studentId, {
      id: studentId,
      name,
      socketId: socket.id,
      hasAnswered: currentPoll ? false : null
    });
    
    socket.join('students');
    socket.studentId = studentId;
    
    // Send current poll to student
    socket.emit('current-poll', currentPoll);
    
    // Update teachers with new student list
    io.to('teachers').emit('students-list', Array.from(students.values()));
  });

  // Teacher creates a new poll
  socket.on('create-poll', (pollData) => {
    // Check if all students have answered or no poll exists
    const allAnswered = currentPoll ? Array.from(students.values()).every(s => s.hasAnswered) : true;
    
    if (!currentPoll || allAnswered) {
      currentPoll = {
        id: uuidv4(),
        question: pollData.question,
        options: pollData.options.map(opt => ({ id: uuidv4(), text: opt })),
        createdAt: new Date(),
        timeLimit: pollData.timeLimit || 60,
        isActive: true
      };

      // Reset poll results
      pollResults.clear();
      currentPoll.options.forEach(option => {
        pollResults.set(option.id, 0);
      });

      // Reset student answered status
      students.forEach(student => {
        student.hasAnswered = false;
      });

      // Broadcast new poll to all users
      io.emit('new-poll', currentPoll);
      io.to('teachers').emit('students-list', Array.from(students.values()));

      // Start timer
      setTimeout(() => {
        if (currentPoll && currentPoll.id === pollData.id) {
          endCurrentPoll();
        }
      }, currentPoll.timeLimit * 1000);
    } else {
      socket.emit('poll-creation-error', 'Cannot create poll while students are still answering');
    }
  });

  // Student submits answer
  socket.on('submit-answer', (data) => {
    const { studentId, optionId } = data;
    const student = students.get(studentId);
    
    if (student && currentPoll && !student.hasAnswered) {
      student.hasAnswered = true;
      
      // Update poll results
      const currentCount = pollResults.get(optionId) || 0;
      pollResults.set(optionId, currentCount + 1);
      
      // Send updated results to everyone
      const results = Object.fromEntries(pollResults);
      io.emit('poll-results', results);
      io.to('teachers').emit('students-list', Array.from(students.values()));
      
      // Check if all students have answered
      const allAnswered = Array.from(students.values()).every(s => s.hasAnswered);
      if (allAnswered) {
        endCurrentPoll();
      }
    }
  });

  // Chat functionality
  socket.on('send-chat-message', (message) => {
    const chatMessage = {
      ...message,
      timestamp: new Date().toISOString()
    };
    chatMessages.push(chatMessage);
    
    // Broadcast to all users
    io.emit('chat-message', chatMessage);
  });

  socket.on('get-chat-history', () => {
    socket.emit('chat-history', chatMessages);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove student if they disconnect
    if (socket.studentId) {
      students.delete(socket.studentId);
      io.to('teachers').emit('students-list', Array.from(students.values()));
    }
  });
});

function endCurrentPoll() {
  if (currentPoll) {
    currentPoll.isActive = false;
    currentPoll.results = Object.fromEntries(pollResults);
    pastPolls.push({ ...currentPoll });
    
    io.emit('poll-ended', {
      poll: currentPoll,
      results: Object.fromEntries(pollResults)
    });
  }
}

// REST API endpoints
app.get('/api/past-polls', (req, res) => {
  res.json(pastPolls);
});

app.get('/api/current-poll', (req, res) => {
  res.json(currentPoll);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

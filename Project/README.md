# Live Polling System

A real-time polling system with Teacher and Student personas built with React and Express.js + Socket.io.

## Features

### Teacher Features
- Create new polls with multiple choice options
- View live polling results in real-time
- See connected students and their response status
- View past poll results
- Configurable time limits (10-300 seconds)

### Student Features
- Enter name on first visit (unique to each tab)
- Submit answers to active polls
- View live results after submission
- 60-second default timer with visual countdown
- Real-time updates

## Technology Stack
- **Frontend**: React with Redux Toolkit
- **Backend**: Express.js with Socket.io
- **Real-time Communication**: WebSockets via Socket.io
- **State Management**: Redux Toolkit

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start both frontend and backend simultaneously:**
   ```bash
   npm run dev
   ```

   Or run them separately:

2. **Start backend server:**
   ```bash
   npm run server
   ```

3. **Start frontend (in another terminal):**
   ```bash
   npm run client
   ```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. **Teacher Setup:**
   - Open the application
   - Select "Teacher" role
   - Create polls with questions and multiple options
   - Monitor student responses in real-time

2. **Student Setup:**
   - Open the application (can be multiple tabs/devices)
   - Select "Student" role
   - Enter your name
   - Wait for teacher to create a poll
   - Submit your answer within the time limit

## Project Structure

```
live-polling-system/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # Socket.io service
│   │   ├── store/         # Redux store and slices
│   │   ├── App.js         # Main App component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json with scripts
└── README.md             # This file
```

## Deployment

The application is ready for deployment on platforms like:
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean

### Environment Variables
For production deployment, set:
- `PORT` - Backend server port (default: 5000)
- Frontend should point to your deployed backend URL

## Features Implemented

✅ **Must-Have Requirements:**
- Functional system with all core features
- Teacher can create polls and students can answer
- Both can view poll results
- Real-time updates via Socket.io
- UI follows modern design principles

✅ **Good to Have:**
- Configurable poll time limit by teacher
- Well-designed user interface
- Responsive design

✅ **Bonus Features:**
- Teacher can view past poll results
- Real-time student connection status
- Visual progress bars for results
- Timer countdown for students

## API Endpoints

- `GET /api/past-polls` - Retrieve past poll results
- `GET /api/current-poll` - Get current active poll

## Socket Events

### Teacher Events
- `join-teacher` - Join as teacher
- `create-poll` - Create a new poll
- `students-list` - Receive student updates
- `poll-results` - Receive live results

### Student Events
- `join-student` - Join as student with name
- `submit-answer` - Submit poll answer
- `current-poll` - Receive current poll
- `poll-results` - Receive live results

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

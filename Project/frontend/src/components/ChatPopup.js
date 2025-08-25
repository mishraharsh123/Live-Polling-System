import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

const ChatPopup = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { userRole, studentName } = useSelector(state => state.poll);

  useEffect(() => {
    if (isOpen) {
      // Set up chat event listeners
      socketService.on('chat-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socketService.on('chat-history', (history) => {
        setMessages(history);
      });

      // Request chat history when opening
      socketService.socket?.emit('get-chat-history');
    }

    return () => {
      socketService.off('chat-message');
      socketService.off('chat-history');
    };
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage.trim(),
        sender: userRole === 'teacher' ? 'Teacher' : studentName,
        senderType: userRole,
        timestamp: new Date().toISOString()
      };

      socketService.socket?.emit('send-chat-message', message);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-popup">
        <div className="chat-header">
          <h3>Chat</h3>
          <button onClick={onClose} className="chat-close-btn">×</button>
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 ? (
            <p className="chat-empty">No messages yet. Start the conversation!</p>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`chat-message ${message.senderType === userRole ? 'own-message' : 'other-message'}`}
              >
                <div className="message-header">
                  <span className="message-sender">{message.sender}</span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            maxLength={500}
          />
          <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPopup;

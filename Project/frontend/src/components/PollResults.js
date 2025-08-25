import React from 'react';

const PollResults = ({ poll, results, title }) => {
  if (!poll || !results) return null;

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className="results-container">
      <h3 className="results-title">{title}</h3>
      
      <div className="poll-question" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
        {poll.question}
      </div>

      {totalVotes === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No responses yet
        </p>
      ) : (
        <div>
          {poll.options.map(option => {
            const count = results[option.id] || 0;
            const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
            
            return (
              <div key={option.id} className="result-item">
                <div className="result-option">
                  <span>{option.text}</span>
                  <span>{count} vote{count !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="result-bar">
                  <div 
                    className="result-fill" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Total responses: {totalVotes}
          </div>
        </div>
      )}
    </div>
  );
};

export default PollResults;

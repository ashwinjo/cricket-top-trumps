import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard(20); // Get top 20 players
        setLeaderboard(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  if (loading) {
    return (
      <div className="leaderboard-container">
        <h2>Leaderboard</h2>
        <div className="loading">Loading leaderboard data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="leaderboard-container">
        <h2>Leaderboard</h2>
        <div className="error">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      
      {leaderboard.length === 0 ? (
        <div className="no-data">
          <p>No players have completed games yet.</p>
          <p>Be the first to join the leaderboard!</p>
        </div>
      ) : (
        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Games</th>
                <th>Wins</th>
                <th>Win %</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index} className={index < 3 ? 'top-rank' : ''}>
                  <td>#{index + 1}</td>
                  <td>{entry.player_name}</td>
                  <td>{entry.games_played}</td>
                  <td>{entry.wins}</td>
                  <td>{entry.win_percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="leaderboard-info">
        <h3>How to Join the Leaderboard</h3>
        <p>Complete games to have your results recorded on the leaderboard.</p>
        <p>The more games you win, the higher your ranking will be!</p>
      </div>
    </div>
  );
};

export default Leaderboard; 
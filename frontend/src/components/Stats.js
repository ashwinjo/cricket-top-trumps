import React, { useState, useEffect } from 'react';
import { getGameStats, getTopPlayers } from '../services/api';

const Stats = () => {
  const [gameStats, setGameStats] = useState(null);
  const [topBatters, setTopBatters] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get overall game stats
        const stats = await getGameStats();
        setGameStats(stats);
        
        // Get top players by batting and bowling stats
        const batters = await getTopPlayers('batting_average', 5);
        setTopBatters(batters);
        
        const bowlers = await getTopPlayers('wickets_taken', 5);
        setTopBowlers(bowlers);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load game statistics. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="stats-container">
        <h2>Game Statistics</h2>
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="stats-container">
        <h2>Game Statistics</h2>
        <div className="error">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="stats-container">
      <h2>Game Statistics</h2>
      
      <div className="stats-grid">
        {/* Overall game stats */}
        <div className="stats-card">
          <h3>Overall Stats</h3>
          <div className="stat-item">
            <span className="stat-label">Total Games:</span>
            <span className="stat-value">{gameStats.total_games}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Player Wins:</span>
            <span className="stat-value">{gameStats.player_wins}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">AI Wins:</span>
            <span className="stat-value">{gameStats.ai_wins}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg. Rounds per Game:</span>
            <span className="stat-value">{gameStats.average_rounds.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Most Used Stat:</span>
            <span className="stat-value">{gameStats.most_used_stat}</span>
          </div>
        </div>
        
        {/* Top batters */}
        <div className="stats-card">
          <h3>Top Batters</h3>
          {topBatters.length === 0 ? (
            <p>No data available</p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Average</th>
                  <th>Runs</th>
                </tr>
              </thead>
              <tbody>
                {topBatters.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.batting_average.toFixed(2)}</td>
                    <td>{player.total_runs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Top bowlers */}
        <div className="stats-card">
          <h3>Top Bowlers</h3>
          {topBowlers.length === 0 ? (
            <p>No data available</p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Wickets</th>
                  <th>Best</th>
                </tr>
              </thead>
              <tbody>
                {topBowlers.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.wickets_taken}</td>
                    <td>{player.best_bowling_wickets}/{player.best_bowling_runs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <div className="stats-facts">
        <h3>Did You Know?</h3>
        <p>
          In cricket, a strike rate above 140 in T20 cricket is considered exceptional for a batter.
        </p>
        <p>
          The best bowlers often have a combination of wicket-taking ability and economy in limiting runs.
        </p>
      </div>
    </div>
  );
};

export default Stats; 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Header = () => {
  const location = useLocation();
  const { gameStatus, playerName } = useGame();
  
  // Don't show header during active gameplay to avoid distractions
  if (location.pathname === '/game' && gameStatus === 'active') {
    return (
      <header className="game-header">
        <h1>Ek Tappa Out</h1>
        <div className="player-info">
          {playerName !== 'Player' && <span>Playing as: {playerName}</span>}
        </div>
      </header>
    );
  }
  
  return (
    <header className="main-header">
      <div className="logo">
        <h1>Ek Tappa Out</h1>
      </div>
      <nav>
        <ul>
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li className={location.pathname === '/game' ? 'active' : ''}>
            <Link to="/game">Play</Link>
          </li>
          <li className={location.pathname === '/leaderboard' ? 'active' : ''}>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
          <li className={location.pathname === '/stats' ? 'active' : ''}>
            <Link to="/stats">Stats</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 
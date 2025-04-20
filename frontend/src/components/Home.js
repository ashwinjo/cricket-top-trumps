import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleStartGame = (mode) => {
    navigate(`/game/${mode}`);
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Ek Tappa Out</h1>
          <p className="tagline">The Ultimate IPL Top Trumps Challenge</p>
        </div>
      </div>

      <div className="game-description">
        <h2>Welcome to Ek Tappa Out!</h2>
        <p>
          Ek Tappa Out is a digital adaptation of the classic Top Trumps card game,
          featuring cricket players from the Indian Premier League (IPL).
          Compete by comparing statistics on your player cards, and aim to win all cards from your opponent.
        </p>

        <h3>How to Play:</h3>
        <ul>
          <li>You and your opponent will each receive a deck of IPL player cards.</li>
          <li>On your turn, you'll select a statistical category from your top card.</li>
          <li>The player whose card has the better value for that stat wins both cards.</li>
          <li>In case of a tie, the player whose turn it was wins the round.</li>
          <li>The game ends when one player collects all the cards.</li>
        </ul>

        <h3>Game Modes:</h3>
        <div className="game-modes">
          <div className="game-mode-card">
            <h3>vs Computer</h3>
            <p>Challenge the computer in a classic 1v1 match.</p>
            <button
              className="btn btn-primary"
              onClick={() => handleStartGame('ai')}
            >
              Play vs Computer
            </button>
          </div>

          <div className="game-mode-card coming-soon">
            <h3>Multiplayer (Coming Soon)</h3>
            <p>Challenge other players in online matches.</p>
            <button className="btn btn-secondary" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
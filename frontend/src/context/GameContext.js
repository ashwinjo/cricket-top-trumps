import React, { createContext, useContext, useState, useEffect } from 'react';
import { createGameSession, updateGameSession, recordGamePlay } from '../services/api';

// Create the context
const GameContext = createContext();

// Hook to use the game context
export const useGame = () => useContext(GameContext);

// Provider component
export const GameProvider = ({ children }) => {
  // Game session state
  const [sessionId, setSessionId] = useState(null);
  const [playerName, setPlayerName] = useState('Player');
  const [difficulty, setDifficulty] = useState('medium');
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [gameWinner, setGameWinner] = useState(null);

  // Game state
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [currentPlayerCard, setCurrentPlayerCard] = useState(null);
  const [currentAiCard, setCurrentAiCard] = useState(null);
  const [warPile, setWarPile] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [selectedStat, setSelectedStat] = useState(null);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, loading, active, finished

  // Stats tracking
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [statsUsed, setStatsUsed] = useState({});

  // Start a new game session
  const startGameSession = async (name, diff = 'medium') => {
    try {
      setGameStatus('loading');
      setPlayerName(name);
      setDifficulty(diff);
      
      // Create a session in the API
      const session = await createGameSession(name, diff);
      setSessionId(session.id);
      
      // Reset game state
      setRoundsPlayed(0);
      setGameWinner(null);
      setWarPile([]);
      setPlayerWins(0);
      setAiWins(0);
      setStatsUsed({});
      
      return session.id;
    } catch (error) {
      console.error('Failed to start game session:', error);
      setGameStatus('error');
      return null;
    }
  };

  // Update the session with the latest state
  const updateSession = async () => {
    if (!sessionId) return;
    
    try {
      await updateGameSession(sessionId, {
        rounds_played: roundsPlayed,
        winner: gameWinner
      });
    } catch (error) {
      console.error('Failed to update game session:', error);
    }
  };

  // Record a stat selection
  const recordStatSelection = async (statName, isAiTurn, didWin) => {
    if (!sessionId || !currentPlayerCard) return;
    
    // Update local stats tracking
    setStatsUsed(prev => ({
      ...prev,
      [statName]: (prev[statName] || 0) + 1
    }));
    
    try {
      // Record for the player card
      await recordGamePlay({
        player_id: currentPlayerCard.id,
        game_session_id: sessionId,
        is_ai_player: isAiTurn,
        won_rounds: didWin ? 1 : 0,
        lost_rounds: didWin ? 0 : 1,
        stats_used: statName
      });
      
      // Record for the AI card if it exists
      if (currentAiCard) {
        await recordGamePlay({
          player_id: currentAiCard.id,
          game_session_id: sessionId,
          is_ai_player: !isAiTurn,
          won_rounds: didWin ? 0 : 1,
          lost_rounds: didWin ? 1 : 0,
          stats_used: statName
        });
      }
    } catch (error) {
      console.error('Failed to record game play:', error);
    }
  };

  // End the game and update the session
  const endGame = async (winner) => {
    setGameWinner(winner);
    setGameStatus('finished');
    
    if (winner === 'player') {
      setPlayerWins(prev => prev + 1);
    } else {
      setAiWins(prev => prev + 1);
    }
    
    // Update session in API
    try {
      await updateGameSession(sessionId, {
        rounds_played: roundsPlayed,
        winner: winner,
        end_time: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to end game session:', error);
    }
  };

  // Update session whenever relevant state changes
  useEffect(() => {
    if (sessionId && gameStatus === 'active') {
      updateSession();
    }
  }, [roundsPlayed, gameWinner]);

  // Value object for the context provider
  const value = {
    // Session state
    sessionId,
    playerName,
    difficulty,
    roundsPlayed,
    setRoundsPlayed,
    gameWinner,
    
    // Game state
    playerCards,
    setPlayerCards,
    aiCards,
    setAiCards,
    currentPlayerCard,
    setCurrentPlayerCard,
    currentAiCard,
    setCurrentAiCard,
    warPile,
    setWarPile,
    isPlayerTurn,
    setIsPlayerTurn,
    selectedStat,
    setSelectedStat,
    gameStatus,
    setGameStatus,
    
    // Stats
    playerWins,
    aiWins,
    statsUsed,
    
    // Actions
    startGameSession,
    recordStatSelection,
    endGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext; 
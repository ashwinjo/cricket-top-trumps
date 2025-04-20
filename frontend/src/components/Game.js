import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import { getGameCards } from '../services/api';

const Game = ({ gameMode }) => {
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [warPile, setWarPile] = useState([]);
  const [currentPlayerCard, setCurrentPlayerCard] = useState(null);
  const [currentAiCard, setCurrentAiCard] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [selectedStat, setSelectedStat] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [gameStatus, setGameStatus] = useState('loading'); // loading, active, finished
  const [playerCardFlipped, setPlayerCardFlipped] = useState(false);
  const [aiCardFlipped, setAiCardFlipped] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [isComparing, setIsComparing] = useState(false);
  const [playerComparisonResult, setPlayerComparisonResult] = useState(null);
  const [aiComparisonResult, setAiComparisonResult] = useState(null);
  
  // Initialize the game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setGameStatus('loading');
        const cards = await getGameCards(20); // Get 20 cards
        
        // Shuffle the cards
        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        
        // Split the cards between player and AI
        const halfPoint = Math.ceil(shuffledCards.length / 2);
        const playerInitialCards = shuffledCards.slice(0, halfPoint);
        const aiInitialCards = shuffledCards.slice(halfPoint);
        
        setPlayerCards(playerInitialCards);
        setAiCards(aiInitialCards);
        
        // Set the first cards
        setCurrentPlayerCard(playerInitialCards[0]);
        setCurrentAiCard(aiInitialCards[0]);
        
        // Always set player to go first for better UX
        setIsPlayerTurn(true);
        
        setGameStatus('active');
        setPlayerCardFlipped(true); // Player can see their card
        setAiCardFlipped(false);   // AI card stays hidden until player selects
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setGameStatus('error');
      }
    };

    initializeGame();
  }, [gameMode]);

  // Handle stat selection (wrapped in useCallback to avoid dependency issues)
  const handleStatSelection = useCallback((statName) => {
    if (isComparing || selectedStat) return;
    
    console.log('Stat selected:', statName);
    setSelectedStat(statName);
    setIsComparing(true);
    
    // If player selected stat, now reveal AI card
    if (isPlayerTurn) {
      setAiCardFlipped(true);
    }
    
    // Compare the selected stat
    const playerValue = currentPlayerCard[statName];
    const aiValue = currentAiCard[statName];
    
    let winner = null;
    
    // Special case for best_bowling_wickets
    if (statName === 'best_bowling_wickets' && playerValue === aiValue) {
      // Tie-breaker: Player with fewer runs conceded in that performance wins
      const playerRunsConceded = currentPlayerCard.best_bowling_runs;
      const aiRunsConceded = currentAiCard.best_bowling_runs;
      
      if (playerRunsConceded < aiRunsConceded) {
        winner = 'player';
        setRoundResult('player');
        setPlayerComparisonResult('win');
        setAiComparisonResult('lose');
      } else if (aiRunsConceded < playerRunsConceded) {
        winner = 'ai';
        setRoundResult('ai');
        setPlayerComparisonResult('lose');
        setAiComparisonResult('win');
      } else {
        // Complete tie
        handleTie();
        return; // Exit early for tie case
      }
    } else if (playerValue > aiValue) {
      winner = 'player';
      setRoundResult('player');
      setPlayerComparisonResult('win');
      setAiComparisonResult('lose');
    } else if (aiValue > playerValue) {
      winner = 'ai';
      setRoundResult('ai');
      setPlayerComparisonResult('lose');
      setAiComparisonResult('win');
    } else {
      // Tie rule: Player whose turn it was wins
      if (isPlayerTurn) {
        winner = 'player';
        setRoundResult('player');
        setPlayerComparisonResult('win');
        setAiComparisonResult('lose');
      } else {
        winner = 'ai';
        setRoundResult('ai');
        setPlayerComparisonResult('lose');
        setAiComparisonResult('win');
      }
    }
    
    console.log('Round winner:', winner);
    
    // Proceed to the next round after a delay
    setTimeout(() => handleRoundEnd(winner), 2000);
  }, [isComparing, selectedStat, currentPlayerCard, currentAiCard, isPlayerTurn]);

  // Handle a tie in the round
  const handleTie = () => {
    setRoundResult('tie');
    setPlayerComparisonResult('tie');
    setAiComparisonResult('tie');
    
    // Move cards to war pile
    setWarPile([...warPile, currentPlayerCard, currentAiCard]);
    
    // Remove cards from players' decks
    const updatedPlayerCards = [...playerCards.slice(1)];
    const updatedAiCards = [...aiCards.slice(1)];
    
    setPlayerCards(updatedPlayerCards);
    setAiCards(updatedAiCards);
    
    // Set next cards
    setCurrentPlayerCard(updatedPlayerCards[0] || null);
    setCurrentAiCard(updatedAiCards[0] || null);
    
    // Check for game end
    if (updatedPlayerCards.length === 0 || updatedAiCards.length === 0) {
      handleGameEnd();
    } else {
      // Next round setup
      setRoundsPlayed(roundsPlayed + 1);
      setSelectedStat(null);
      setIsComparing(false);
      setPlayerCardFlipped(true);
      setAiCardFlipped(false);
    }
  };

  // AI's turn to select a stat
  useEffect(() => {
    if (gameStatus === 'active' && !isPlayerTurn && !selectedStat && !isComparing) {
      console.log("AI's turn to select a stat");
      // Modified AI strategy: Select stat based on player role
      const aiSelectStat = () => {
        if (!currentAiCard) return;
        
        // Define the stats that can be selected
        const selectableStats = [
          'total_runs',
          'highest_score',
          'batting_average',
          'strike_rate',
          'fifties_hundreds',
          'sixes_hit',
          'wickets_taken',
          'best_bowling_wickets'
        ];
        
        // Role-based stat selection with randomization
        let preferredStats = [];
        const role = currentAiCard.role;
        
        if (role === 'Batter') {
          // Batters prefer batting stats
          preferredStats = [
            'total_runs',
            'highest_score',
            'batting_average',
            'strike_rate',
            'fifties_hundreds',
            'sixes_hit'
          ];
        } else if (role === 'Bowler') {
          // Bowlers prefer bowling stats
          preferredStats = [
            'wickets_taken',
            'best_bowling_wickets'
          ];
        } else if (role === 'AllRounder') {
          // All-rounders might prefer any stat but with bias for their strengths
          const allRounderPreferredStats = [...selectableStats];
          // Determine if the all-rounder is batting or bowling focused
          if (currentAiCard.total_runs > 2000 || currentAiCard.batting_average > 30) {
            // Batting all-rounder
            preferredStats = [
              'total_runs',
              'highest_score',
              'batting_average',
              'strike_rate',
              'wickets_taken'
            ];
          } else {
            // Bowling all-rounder
            preferredStats = [
              'wickets_taken',
              'best_bowling_wickets',
              'total_runs',
              'strike_rate'
            ];
          }
        }
        
        // Pick randomly from preferred stats with higher probability
        const usePreferredStat = Math.random() < 0.7; // 70% chance to use preferred
        
        let selectedStatPool = usePreferredStat && preferredStats.length > 0
          ? preferredStats
          : selectableStats;
        
        // Find the highest value in the selected pool as a fallback strategy
        let bestStat = selectedStatPool[0];
        let bestValue = currentAiCard[bestStat];
        
        selectedStatPool.forEach(stat => {
          if (currentAiCard[stat] > bestValue) {
            bestStat = stat;
            bestValue = currentAiCard[stat];
          }
        });
        
        // 30% chance to pick the best stat, 70% chance to pick randomly from pool
        const randomSelect = Math.random() < 0.7;
        const finalStat = randomSelect 
          ? selectedStatPool[Math.floor(Math.random() * selectedStatPool.length)]
          : bestStat;
        
        // Wait a moment before making the selection to simulate thinking
        setTimeout(() => {
          console.log("AI selecting stat:", finalStat);
          handleStatSelection(finalStat);
        }, 1500);
      };
      
      // Flip AI card and make a selection
      setAiCardFlipped(true);
      aiSelectStat();
    }
  }, [gameStatus, isPlayerTurn, selectedStat, currentAiCard, isComparing, handleStatSelection]);

  // Handle the end of a round with winner parameter
  const handleRoundEnd = (winner) => {
    console.log('Handling round end, winner:', winner);
    setRoundsPlayed(roundsPlayed + 1);
    
    let updatedPlayerCards = [...playerCards];
    let updatedAiCards = [...aiCards];
    
    // Remove the current cards from both players' decks
    updatedPlayerCards = updatedPlayerCards.slice(1);
    updatedAiCards = updatedAiCards.slice(1);
    
    // Add cards to the winner's deck
    if (winner === 'player') {
      updatedPlayerCards.push(currentPlayerCard, currentAiCard, ...warPile);
      setIsPlayerTurn(true); // Player gets to choose next
    } else if (winner === 'ai') {
      updatedAiCards.push(currentPlayerCard, currentAiCard, ...warPile);
      setIsPlayerTurn(false); // AI chooses next
    }
    
    // Clear the war pile
    setWarPile([]);
    
    // Update state
    setPlayerCards(updatedPlayerCards);
    setAiCards(updatedAiCards);
    
    // Set the next cards
    setCurrentPlayerCard(updatedPlayerCards[0] || null);
    setCurrentAiCard(updatedAiCards[0] || null);
    
    // Check for game end
    if (updatedPlayerCards.length === 0 || updatedAiCards.length === 0) {
      handleGameEnd();
    } else {
      // Reset for next round
      setSelectedStat(null);
      setRoundResult(null);
      setIsComparing(false);
      setPlayerComparisonResult(null);
      setAiComparisonResult(null);
      setPlayerCardFlipped(true);
      
      // Hide AI card if it's player's turn (new feature)
      setAiCardFlipped(!isPlayerTurn);
    }
  };

  // Handle the end of the game
  const handleGameEnd = () => {
    setGameStatus('finished');
    console.log("Game ending. Player cards:", playerCards.length, "AI cards:", aiCards.length);
    
    // Determine the winner based on who has cards left or who has most cards
    if (playerCards.length === 0) {
      // Player has no cards left, AI wins
      setRoundResult('ai');
      console.log("Computer wins - you have no cards left");
    } else if (aiCards.length === 0) {
      // AI has no cards left, player wins
      setRoundResult('player');
      console.log("You win - computer has no cards left");
    } else if (playerCards.length > aiCards.length) {
      // Player has more cards, player wins
      setRoundResult('player');
      console.log("You win - you have more cards:", playerCards.length, "vs", aiCards.length);
    } else if (aiCards.length > playerCards.length) {
      // AI has more cards, AI wins
      setRoundResult('ai');
      console.log("Computer wins - computer has more cards:", aiCards.length, "vs", playerCards.length);
    } else {
      // Equal number of cards, it's a tie
      setRoundResult('tie');
      console.log("It's a tie - both have same number of cards:", playerCards.length);
    }
  };

  // Start a new game
  const handleNewGame = async () => {
    try {
      setGameStatus('loading');
      setPlayerCards([]);
      setAiCards([]);
      setWarPile([]);
      setCurrentPlayerCard(null);
      setCurrentAiCard(null);
      setIsPlayerTurn(true);
      setSelectedStat(null);
      setRoundResult(null);
      setRoundsPlayed(0);
      setIsComparing(false);
      setPlayerComparisonResult(null);
      setAiComparisonResult(null);
      
      const cards = await getGameCards(20);
      const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
      
      const halfPoint = Math.ceil(shuffledCards.length / 2);
      const playerInitialCards = shuffledCards.slice(0, halfPoint);
      const aiInitialCards = shuffledCards.slice(halfPoint);
      
      setPlayerCards(playerInitialCards);
      setAiCards(aiInitialCards);
      
      setCurrentPlayerCard(playerInitialCards[0]);
      setCurrentAiCard(aiInitialCards[0]);
      
      setIsPlayerTurn(true);
      setGameStatus('active');
      setPlayerCardFlipped(true);
      setAiCardFlipped(false); // Hide AI card initially
    } catch (error) {
      console.error('Failed to start new game:', error);
      setGameStatus('error');
    }
  };

  // Render game status
  const renderGameStatus = () => {
    if (gameStatus === 'loading') {
      return <div className="game-status">Loading game...</div>;
    } else if (gameStatus === 'error') {
      return <div className="game-status">Error loading game. Please try again.</div>;
    } else if (gameStatus === 'finished') {
      let message = 'Game Over! ';
      let victoryImage = null;
      
      if (roundResult === 'player') {
        message += 'You Win! 🏆';
        victoryImage = 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif'; // Trophy celebration GIF
      } else if (roundResult === 'ai') {
        message += 'Computer Wins! 😔';
        victoryImage = 'https://media.giphy.com/media/l0HlBog9hAnNvPzCo/giphy.gif'; // Computer win GIF
      } else {
        message += 'It\'s a tie!';
        victoryImage = 'https://media.giphy.com/media/xULW8v7LtZrgcaGvC0/giphy.gif'; // Handshake GIF
      }
      
      return (
        <div className="game-info">
          <div className="game-status">{message}</div>
          {victoryImage && (
            <div className="victory-image-container">
              <img 
                src={victoryImage} 
                alt={`${roundResult === 'player' ? 'Victory' : 'Defeat'} image`} 
                className="victory-image" 
              />
            </div>
          )}
          <div>Rounds played: {roundsPlayed}</div>
          <button className="btn btn-primary" onClick={handleNewGame}>
            Play Again
          </button>
        </div>
      );
    } else {
      return (
        <div className="game-info">
          <div className="game-status">
            {isComparing 
              ? `Round ${roundsPlayed + 1}: Comparing ${selectedStat?.replace(/_/g, ' ')}`
              : `Round ${roundsPlayed + 1}`
            }
          </div>
          <div className="player-turn">
            {isPlayerTurn ? 'Your Turn' : 'Computer\'s Turn'}
          </div>
          <div>
            Your Cards: {playerCards.length} | Computer's Cards: {aiCards.length}
            {warPile.length > 0 && ` | War Pile: ${warPile.length}`}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="game-area">
      {renderGameStatus()}
      
      <div className="cards-display">
        <div className="player-side">
          <h3>Your Card</h3>
          <Card
            player={currentPlayerCard}
            isFlipped={playerCardFlipped}
            isActive={isPlayerTurn && gameStatus === 'active' && !isComparing}
            onStatSelect={handleStatSelection}
            selectedStat={selectedStat}
            comparisonResult={playerComparisonResult}
          />
        </div>
        
        <div className="ai-side">
          <h3>Computer's Card</h3>
          <Card
            player={currentAiCard}
            isFlipped={aiCardFlipped}
            isActive={false} // AI's card is never active for user interaction
            onStatSelect={() => {}} // Empty function as AI handles its own selections
            selectedStat={selectedStat}
            comparisonResult={aiComparisonResult}
          />
        </div>
      </div>
      
      <div className="game-controls">
        {gameStatus === 'active' && (
          <button 
            className="btn btn-secondary"
            onClick={() => setPlayerCardFlipped(!playerCardFlipped)}
            disabled={isComparing}
          >
            {playerCardFlipped ? 'Hide Your Card' : 'Show Your Card'}
          </button>
        )}
        
        {gameStatus !== 'loading' && gameStatus !== 'active' && (
          <button className="btn btn-primary" onClick={handleNewGame}>
            {gameStatus === 'finished' ? 'Play Again' : 'New Game'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Game; 
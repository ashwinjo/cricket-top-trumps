import React from 'react';

const Card = ({ 
  player, 
  isFlipped, 
  isActive, 
  onStatSelect, 
  selectedStat, 
  comparisonResult 
}) => {
  const handleStatClick = (statName) => {
    if (isActive && isFlipped) {
      console.log('Player clicked on stat:', statName);
      onStatSelect(statName);
    }
  };

  // Define which stats are displayed and their labels
  const displayStats = [
    { key: 'matches_played', label: 'Matches Played' },
    { key: 'total_runs', label: 'Total Runs' },
    { key: 'highest_score', label: 'Highest Score' },
    { key: 'batting_average', label: 'Batting Average' },
    { key: 'strike_rate', label: 'Strike Rate' },
    { key: 'fifties_hundreds', label: '50s/100s' },
    { key: 'sixes_hit', label: 'Sixes Hit' },
    { key: 'wickets_taken', label: 'Wickets Taken' },
    { key: 'best_bowling_wickets', label: 'Best Bowling (Wickets)' },
  ];

  // Function to determine the class for each stat
  const getStatClass = (statKey) => {
    let classes = '';
    
    // Add clickable class if the card is active (player's turn)
    if (isActive && isFlipped) {
      classes += ' clickable';
    }
    
    // Add selection/comparison result classes
    if (!selectedStat || !comparisonResult) return classes;
    
    if (statKey === selectedStat) {
      if (comparisonResult === 'win') return classes + ' winning';
      if (comparisonResult === 'lose') return classes + ' losing';
      return classes + ' selected';
    }
    
    return classes;
  };

  if (!player) return <div className="card-container">No player data</div>;

  return (
    <div className="card-container">
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face card-front">
          <h2>Ek Tappa Out</h2>
        </div>
        <div className="card-face card-back">
          <div className="card-header">
            <h3>{player.name}</h3>
            <div className="card-role">{player.role}</div>
          </div>
          
          <div className="card-stats">
            {displayStats.map(({ key, label }) => (
              <div 
                key={key}
                className={`card-stat ${getStatClass(key)}`}
                onClick={() => handleStatClick(key)}
              >
                <span className="stat-label">{label}</span>
                <span className="stat-value">
                  {key === 'batting_average' || key === 'strike_rate' 
                    ? player[key].toFixed(2) 
                    : player[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card; 
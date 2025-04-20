# Ek Tappa Out - Cricket Top Trumps

A modern cricket card game where players compete using cards featuring cricket players and their statistics.

![Ek Tappa Out](https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif)

## Application Overview

Ek Tappa Out is a web-based cricket card game inspired by the classic Top Trumps format. Players compete against the computer by comparing cricket player statistics, with strategic decisions determining the winner.

### Key Features

- **Card-Based Gameplay**: Compare cricket player statistics to win cards
- **Strategic Stat Selection**: Choose the best stat from your card to beat your opponent
- **Realistic Cricket Data**: Cards feature real cricket statistics including runs, strike rates, and bowling figures
- **Smart AI Opponent**: Computer opponent uses role-based strategy, focusing on batting stats for batters and bowling stats for bowlers
- **Hidden Opponent Card**: The computer's card remains hidden until you make your selection, adding strategic depth
- **Victory Animations**: Dynamic feedback when you win or lose with celebratory animations
- **Beautiful UI**: Polished card design with vibrant colors and smooth animations

## How to Play

1. Each player (you and the computer) receives a deck of cricket player cards
2. On your turn, select the statistic from your card that you think will beat the computer's card
3. When the computer selects, it will automatically choose based on the player's role and strengths
4. The higher statistic wins the round, and the winner collects both cards
5. The game continues until one player has all the cards
6. The first player to collect all cards wins!

## Stats Explained

- **Matches Played**: Number of matches the player has participated in
- **Total Runs**: Total runs scored throughout career
- **Highest Score**: Highest individual score in an innings
- **Batting Average**: Average runs scored per dismissal
- **Strike Rate**: Runs scored per 100 balls faced
- **50s/100s**: Combined number of half-centuries and centuries
- **Sixes Hit**: Total number of sixes hit
- **Wickets Taken**: Total number of wickets taken
- **Best Bowling**: Best bowling performance (by wickets)

## Technical Implementation

- Built with React.js for the frontend
- RESTful API integration for cricket player data
- Responsive design for all device sizes
- CSS animations for card flipping and game events
- Custom game logic for computer AI strategy
- Background image styling with semi-transparent overlays

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cricket-top-trumps.git
   ```

2. Navigate to the project directory:
   ```
   cd cricket-top-trumps/ek-tappa-out
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Future Enhancements

- Multiplayer functionality for player vs player matches
- Additional card packs featuring more cricket legends
- Tournament mode with bracket-style progression
- Customizable card designs and themes
- Statistics and win tracking

## Credits

- Cricket player data sourced from public cricket databases
- Design inspiration from classic Top Trumps card games
- Background images from [Shutterstock](https://www.shutterstock.com/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
import os
import json
import logging
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal, engine
from espncricinfo.player import Player as ESPNPlayer
from typing import List, Dict, Any
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample data to bootstrap the application
# In a real implementation, this would use python-espncricinfo to fetch real data
SAMPLE_PLAYERS = [
    {
        "name": "Virat Kohli",
        "role": "Batter",
        "matches_played": 237,
        "total_runs": 7263,
        "highest_score": 113,
        "batting_average": 37.28,
        "strike_rate": 130.02,
        "fifties_hundreds": 57,  # 50s + 100s
        "sixes_hit": 234,
        "wickets_taken": 4,
        "best_bowling_wickets": 2,
        "best_bowling_runs": 25
    },
    {
        "name": "Rohit Sharma",
        "role": "Batter",
        "matches_played": 243,
        "total_runs": 6211,
        "highest_score": 109,
        "batting_average": 29.44,
        "strike_rate": 130.26,
        "fifties_hundreds": 42,
        "sixes_hit": 257,
        "wickets_taken": 15,
        "best_bowling_wickets": 2,
        "best_bowling_runs": 4
    },
    {
        "name": "MS Dhoni",
        "role": "Batter",
        "matches_played": 250,
        "total_runs": 5082,
        "highest_score": 84,
        "batting_average": 38.79,
        "strike_rate": 135.93,
        "fifties_hundreds": 24,
        "sixes_hit": 239,
        "wickets_taken": 0,
        "best_bowling_wickets": 0,
        "best_bowling_runs": 0
    },
    {
        "name": "Jasprit Bumrah",
        "role": "Bowler",
        "matches_played": 120,
        "total_runs": 56,
        "highest_score": 10,
        "batting_average": 5.6,
        "strike_rate": 84.85,
        "fifties_hundreds": 0,
        "sixes_hit": 1,
        "wickets_taken": 148,
        "best_bowling_wickets": 5,
        "best_bowling_runs": 10
    },
    {
        "name": "Suresh Raina",
        "role": "Batter",
        "matches_played": 205,
        "total_runs": 5528,
        "highest_score": 100,
        "batting_average": 32.52,
        "strike_rate": 136.73,
        "fifties_hundreds": 39,
        "sixes_hit": 203,
        "wickets_taken": 25,
        "best_bowling_wickets": 2,
        "best_bowling_runs": 6
    },
    {
        "name": "AB de Villiers",
        "role": "Batter",
        "matches_played": 184,
        "total_runs": 5162,
        "highest_score": 133,
        "batting_average": 39.71,
        "strike_rate": 151.69,
        "fifties_hundreds": 40,
        "sixes_hit": 251,
        "wickets_taken": 0,
        "best_bowling_wickets": 0,
        "best_bowling_runs": 0
    },
    {
        "name": "Ravindra Jadeja",
        "role": "AllRounder",
        "matches_played": 226,
        "total_runs": 2692,
        "highest_score": 62,
        "batting_average": 26.92,
        "strike_rate": 134.87,
        "fifties_hundreds": 3,
        "sixes_hit": 94,
        "wickets_taken": 152,
        "best_bowling_wickets": 5,
        "best_bowling_runs": 16
    },
    {
        "name": "Rashid Khan",
        "role": "Bowler",
        "matches_played": 110,
        "total_runs": 347,
        "highest_score": 34,
        "batting_average": 12.86,
        "strike_rate": 172.64,
        "fifties_hundreds": 0,
        "sixes_hit": 31,
        "wickets_taken": 139,
        "best_bowling_wickets": 4,
        "best_bowling_runs": 17
    },
    {
        "name": "David Warner",
        "role": "Batter",
        "matches_played": 176,
        "total_runs": 6065,
        "highest_score": 126,
        "batting_average": 40.99,
        "strike_rate": 139.93,
        "fifties_hundreds": 59,
        "sixes_hit": 225,
        "wickets_taken": 0,
        "best_bowling_wickets": 0,
        "best_bowling_runs": 0
    },
    {
        "name": "Hardik Pandya",
        "role": "AllRounder",
        "matches_played": 123,
        "total_runs": 2309,
        "highest_score": 91,
        "batting_average": 30.38,
        "strike_rate": 146.34,
        "fifties_hundreds": 10,
        "sixes_hit": 138,
        "wickets_taken": 53,
        "best_bowling_wickets": 3,
        "best_bowling_runs": 17
    }
]

def load_sample_data(db: Session):
    """Loads sample data into the database"""
    logger.info("Loading sample player data...")
    
    # Check if players already exist
    existing_count = db.query(models.Player).count()
    if existing_count > 0:
        logger.info(f"Database already contains {existing_count} players. Skipping sample data loading.")
        return
    
    # Add sample players
    for player_data in SAMPLE_PLAYERS:
        player = models.Player(**player_data)
        db.add(player)
    
    db.commit()
    logger.info(f"Successfully loaded {len(SAMPLE_PLAYERS)} sample players")

def fetch_real_ipl_data():
    """
    Fetch real IPL player data using python-espncricinfo
    This is a placeholder function - in a real implementation, 
    it would fetch live data from ESPN Cricinfo
    """
    # In a real implementation, this would use the python-espncricinfo library
    # to fetch player data, process it, and return structured data
    
    # For now, we're just returning the sample data
    return SAMPLE_PLAYERS

def init_db():
    """Initialize the database with player data"""
    db = SessionLocal()
    try:
        # Create tables if they don't exist
        models.Base.metadata.create_all(bind=engine)
        
        # Load sample data
        load_sample_data(db)
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 
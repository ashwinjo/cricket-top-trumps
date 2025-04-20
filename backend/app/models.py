from sqlalchemy import Column, Integer, String, Float, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum
from .database import Base

class PlayerRole(enum.Enum):
    BATTER = "Batter"
    BOWLER = "Bowler"
    ALLROUNDER = "AllRounder"

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String, index=True)  # Enum stored as string
    matches_played = Column(Integer)
    total_runs = Column(Integer)
    highest_score = Column(Integer)
    batting_average = Column(Float)
    strike_rate = Column(Float)
    fifties_hundreds = Column(Integer)  # Combined count of 50s and 100s
    sixes_hit = Column(Integer)
    wickets_taken = Column(Integer)
    best_bowling_wickets = Column(Integer)
    best_bowling_runs = Column(Integer)  # For the tie-breaker rule

    # Add relationship to game cards if needed in future
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "matches_played": self.matches_played,
            "total_runs": self.total_runs,
            "highest_score": self.highest_score,
            "batting_average": self.batting_average,
            "strike_rate": self.strike_rate,
            "fifties_hundreds": self.fifties_hundreds,
            "sixes_hit": self.sixes_hit,
            "wickets_taken": self.wickets_taken,
            "best_bowling_wickets": self.best_bowling_wickets,
            "best_bowling_runs": self.best_bowling_runs
        }

# Can add Game and GamePlayer models for saving game states in the future 
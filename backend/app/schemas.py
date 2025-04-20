from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class PlayerBase(BaseModel):
    name: str
    role: Literal["Batter", "Bowler", "AllRounder"]
    matches_played: int = Field(ge=0)
    total_runs: int = Field(ge=0) 
    highest_score: int = Field(ge=0)
    batting_average: float = Field(ge=0.0)
    strike_rate: float = Field(ge=0.0)
    fifties_hundreds: int = Field(ge=0)
    sixes_hit: int = Field(ge=0)
    wickets_taken: int = Field(ge=0)
    best_bowling_wickets: int = Field(ge=0)
    best_bowling_runs: int = Field(ge=0)

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    
    class Config:
        from_attributes = True

class GameResult(BaseModel):
    winner: str
    rounds_played: int
    
class StatSelection(BaseModel):
    stat_name: Literal[
        "total_runs", 
        "highest_score", 
        "batting_average", 
        "strike_rate", 
        "fifties_hundreds", 
        "sixes_hit", 
        "wickets_taken", 
        "best_bowling_wickets"
    ] 
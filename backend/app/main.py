from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import engine, get_db
from .data_loader import init_db

# Create database tables and load initial data
models.Base.metadata.create_all(bind=engine)
init_db()  # Load sample data at startup

app = FastAPI(
    title="Ek Tappa Out API",
    description="The Ultimate IPL Top Trumps Challenge API",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost:8000",  # If needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Ek Tappa Out API"}

@app.get("/players/", response_model=List[schemas.Player])
def read_players(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    players = crud.get_players(db, skip=skip, limit=limit)
    return players

@app.get("/players/{player_id}", response_model=schemas.Player)
def read_player(player_id: int, db: Session = Depends(get_db)):
    db_player = crud.get_player(db, player_id=player_id)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@app.post("/players/", response_model=schemas.Player)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    return crud.create_player(db=db, player=player)

@app.put("/players/{player_id}", response_model=schemas.Player)
def update_player(player_id: int, player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    db_player = crud.update_player(db, player_id=player_id, player=player)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@app.delete("/players/{player_id}")
def delete_player(player_id: int, db: Session = Depends(get_db)):
    success = crud.delete_player(db, player_id=player_id)
    if not success:
        raise HTTPException(status_code=404, detail="Player not found")
    return {"detail": "Player deleted successfully"}

@app.get("/game/cards", response_model=List[schemas.Player])
def get_game_cards(count: int = 10, db: Session = Depends(get_db)):
    players = crud.get_random_players(db, count=count)
    if not players:
        raise HTTPException(status_code=404, detail="No players found in the database")
    return players 
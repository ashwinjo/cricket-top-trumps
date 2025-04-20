import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.data_loader import SAMPLE_PLAYERS
from app import models

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override for testing
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Test client
client = TestClient(app)

@pytest.fixture(scope="module")
def test_db():
    # Create the test database
    Base.metadata.create_all(bind=engine)
    
    # Add sample data
    db = TestingSessionLocal()
    for player_data in SAMPLE_PLAYERS:
        player = models.Player(**player_data)
        db.add(player)
    db.commit()
    
    yield
    
    # Clean up
    Base.metadata.drop_all(bind=engine)

def test_read_main(test_db):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Ek Tappa Out API"}

def test_read_players(test_db):
    response = client.get("/players/")
    assert response.status_code == 200
    players = response.json()
    assert len(players) == len(SAMPLE_PLAYERS)
    
    # Check if the first player's name matches
    assert players[0]["name"] == SAMPLE_PLAYERS[0]["name"]

def test_read_player(test_db):
    # Get the first player
    response = client.get("/players/1")
    assert response.status_code == 200
    player = response.json()
    assert player["name"] == SAMPLE_PLAYERS[0]["name"]
    
    # Test with invalid player ID
    response = client.get("/players/999")
    assert response.status_code == 404

def test_get_game_cards(test_db):
    response = client.get("/game/cards?count=5")
    assert response.status_code == 200
    cards = response.json()
    assert len(cards) == 5 
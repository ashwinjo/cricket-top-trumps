from app.data_loader import SAMPLE_PLAYERS

def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Ek Tappa Out API"}

def test_read_players(client):
    response = client.get("/players/")
    assert response.status_code == 200
    players = response.json()
    assert len(players) == len(SAMPLE_PLAYERS)
    
    # Check if the first player's name matches
    assert players[0]["name"] == SAMPLE_PLAYERS[0]["name"]

def test_read_player(client):
    # Get the first player
    response = client.get("/players/1")
    assert response.status_code == 200
    player = response.json()
    assert player["name"] == SAMPLE_PLAYERS[0]["name"]
    
    # Test with invalid player ID
    response = client.get("/players/999")
    assert response.status_code == 404

def test_create_player(client):
    new_player = {
        "name": "Test Player",
        "role": "Batter",
        "matches_played": 50,
        "total_runs": 1500,
        "highest_score": 95,
        "batting_average": 30.0,
        "strike_rate": 125.0,
        "fifties_hundreds": 10,
        "sixes_hit": 30,
        "wickets_taken": 0,
        "best_bowling_wickets": 0,
        "best_bowling_runs": 0
    }
    
    response = client.post("/players/", json=new_player)
    assert response.status_code == 200
    created_player = response.json()
    assert created_player["name"] == new_player["name"]
    
    # Verify the player was added
    response = client.get(f"/players/{created_player['id']}")
    assert response.status_code == 200
    assert response.json()["name"] == new_player["name"]

def test_update_player(client):
    # Update the first player
    updated_data = {
        "name": "Updated Player",
        "role": "Batter",
        "matches_played": 100,
        "total_runs": 3000,
        "highest_score": 150,
        "batting_average": 40.0,
        "strike_rate": 140.0,
        "fifties_hundreds": 20,
        "sixes_hit": 100,
        "wickets_taken": 5,
        "best_bowling_wickets": 2,
        "best_bowling_runs": 20
    }
    
    response = client.put("/players/1", json=updated_data)
    assert response.status_code == 200
    updated_player = response.json()
    assert updated_player["name"] == updated_data["name"]
    
    # Verify the player was updated
    response = client.get("/players/1")
    assert response.status_code == 200
    assert response.json()["name"] == updated_data["name"]

def test_delete_player(client):
    # Create a player to delete
    new_player = {
        "name": "Player to Delete",
        "role": "Batter",
        "matches_played": 10,
        "total_runs": 300,
        "highest_score": 50,
        "batting_average": 30.0,
        "strike_rate": 120.0,
        "fifties_hundreds": 1,
        "sixes_hit": 5,
        "wickets_taken": 0,
        "best_bowling_wickets": 0,
        "best_bowling_runs": 0
    }
    
    response = client.post("/players/", json=new_player)
    player_id = response.json()["id"]
    
    # Delete the player
    response = client.delete(f"/players/{player_id}")
    assert response.status_code == 200
    
    # Verify the player was deleted
    response = client.get(f"/players/{player_id}")
    assert response.status_code == 404

def test_get_game_cards(client):
    response = client.get("/game/cards?count=5")
    assert response.status_code == 200
    cards = response.json()
    assert len(cards) == 5 
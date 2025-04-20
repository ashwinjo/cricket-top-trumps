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

@pytest.fixture
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

@pytest.fixture
def client(test_db):
    # Dependency override for testing
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c 
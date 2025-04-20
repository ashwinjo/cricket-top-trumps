from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def get_player(db: Session, player_id: int) -> Optional[models.Player]:
    return db.query(models.Player).filter(models.Player.id == player_id).first()

def get_player_by_name(db: Session, name: str) -> Optional[models.Player]:
    return db.query(models.Player).filter(models.Player.name == name).first()

def get_players(db: Session, skip: int = 0, limit: int = 100) -> List[models.Player]:
    return db.query(models.Player).offset(skip).limit(limit).all()

def create_player(db: Session, player: schemas.PlayerCreate) -> models.Player:
    db_player = models.Player(**player.model_dump())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def update_player(db: Session, player_id: int, player: schemas.PlayerCreate) -> Optional[models.Player]:
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if db_player:
        update_data = player.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_player, key, value)
        db.commit()
        db.refresh(db_player)
    return db_player

def delete_player(db: Session, player_id: int) -> bool:
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if db_player:
        db.delete(db_player)
        db.commit()
        return True
    return False

def get_random_players(db: Session, count: int = 10) -> List[models.Player]:
    """Get a random selection of players for a game"""
    # Using SQLAlchemy's func.random() for SQLite
    from sqlalchemy.sql.expression import func
    return db.query(models.Player).order_by(func.random()).limit(count).all() 
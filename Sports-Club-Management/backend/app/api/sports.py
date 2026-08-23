from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.sport import Sport
from app.models.equipment import Equipment
from app.models.user import User
from app.models.event import Event
from app.schemas.sport_schema import SportCreate, SportResponse
from app.schemas.equipment_schema import EquipmentCreate, EquipmentResponse

router = APIRouter(
    prefix="/sports",
    tags=["Sports & Utilities"]
)

@router.get("", response_model=List[SportResponse])
def get_all_sports(db: Session = Depends(get_db)):
    return db.query(Sport).all()

@router.post("", response_model=SportResponse, status_code=status.HTTP_201_CREATED)
def create_sport(payload: SportCreate, db: Session = Depends(get_db)):
    existing = db.query(Sport).filter(Sport.name.ilike(payload.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Sport already exists")
    
    sport = Sport(
        name=payload.name,
        monthly_fee=payload.monthly_fee,
        annual_fee=payload.annual_fee,
        description=payload.description
    )
    db.add(sport)
    db.commit()
    db.refresh(sport)
    return sport

@router.delete("/{sport_name}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sport(sport_name: str, db: Session = Depends(get_db)):
    sport = db.query(Sport).filter(Sport.name.ilike(sport_name)).first()
    if not sport:
        raise HTTPException(status_code=404, detail="Sport not found")
    
    # Check if coach or member count > 0
    users_in_sport = db.query(User).filter(User.sport.ilike(sport_name)).count()
    if users_in_sport > 0:
        raise HTTPException(status_code=400, detail=f"Cannot delete sport '{sport_name}': {users_in_sport} users enrolled.")
    
    # Remove equipment and sport
    db.query(Equipment).filter(Equipment.sport_name.ilike(sport_name)).delete(synchronize_session=False)
    db.delete(sport)
    db.commit()

@router.get("/{sport_name}/utilities", response_model=List[EquipmentResponse])
def get_sport_utilities(sport_name: str, db: Session = Depends(get_db)):
    return db.query(Equipment).filter(Equipment.sport_name.ilike(sport_name)).all()

@router.post("/{sport_name}/utilities", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
def add_sport_utility(sport_name: str, payload: EquipmentCreate, db: Session = Depends(get_db)):
    existing = db.query(Equipment).filter(
        Equipment.sport_name.ilike(sport_name),
        Equipment.name.ilike(payload.name)
    ).first()
    
    if existing:
        existing.total_quantity += payload.total_quantity
        existing.available_quantity += payload.total_quantity
        db.commit()
        db.refresh(existing)
        return existing
    
    equip = Equipment(
        sport_name=sport_name,
        name=payload.name,
        total_quantity=payload.total_quantity,
        available_quantity=payload.total_quantity
    )
    db.add(equip)
    db.commit()
    db.refresh(equip)
    return equip

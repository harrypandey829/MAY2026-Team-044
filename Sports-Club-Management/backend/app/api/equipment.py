from datetime import datetime, timedelta, timezone
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.equipment import Equipment
from app.models.equipment_issuance import EquipmentIssuance
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.equipment_schema import (
    EquipmentIssueRequest,
    EquipmentIssuanceResponse,
    EquipmentCreate,
    EquipmentResponse
)

router = APIRouter(
    prefix="/equipment",
    tags=["Equipment Issuance"]
)

@router.get("", response_model=List[EquipmentResponse])
def get_equipment_list(
    sport_name: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Equipment)
    if sport_name:
        query = query.filter(Equipment.sport_name.ilike(sport_name))
    return query.all()

@router.post("", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
def create_equipment(
    payload: EquipmentCreate,
    db: Session = Depends(get_db)
):
    equip = Equipment(
        sport_name=payload.sport_name,
        name=payload.name,
        total_quantity=payload.total_quantity,
        available_quantity=payload.total_quantity
    )
    db.add(equip)
    db.commit()
    db.refresh(equip)
    return equip

@router.post("/issue", response_model=EquipmentIssuanceResponse, status_code=status.HTTP_201_CREATED)
def issue_equipment(
    payload: EquipmentIssueRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    equip = db.query(Equipment).filter(Equipment.id == payload.equipment_id).first()
    if not equip:
        raise HTTPException(status_code=404, detail="Equipment item not found")
    
    if equip.available_quantity < payload.quantity:
        raise HTTPException(status_code=400, detail=f"Only {equip.available_quantity} available.")
    
    now = datetime.now(timezone.utc)
    expected_return = now + timedelta(hours=payload.duration_hours)
    
    equip.available_quantity -= payload.quantity
    
    issuance = EquipmentIssuance(
        member_id=current_user.id,
        equipment_id=equip.id,
        sport_name=equip.sport_name,
        quantity=payload.quantity,
        issued_at=now,
        duration_hours=payload.duration_hours,
        expected_return_at=expected_return,
        status="ISSUED"
    )
    
    db.add(issuance)
    db.commit()
    db.refresh(issuance)
    return issuance

@router.post("/return/{issuance_id}", response_model=EquipmentIssuanceResponse)
def return_equipment(
    issuance_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    issuance = db.query(EquipmentIssuance).filter(EquipmentIssuance.id == issuance_id).first()
    if not issuance:
        raise HTTPException(status_code=404, detail="Issuance record not found")
    
    if issuance.status == "RETURNED":
        return issuance
    
    now = datetime.now(timezone.utc)
    issuance.status = "RETURNED"
    issuance.returned_at = now
    
    equip = db.query(Equipment).filter(Equipment.id == issuance.equipment_id).first()
    if equip:
        equip.available_quantity += issuance.quantity
    
    db.commit()
    db.refresh(issuance)
    return issuance

@router.get("/my-issuances", response_model=List[EquipmentIssuanceResponse])
def get_my_issuances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.now(timezone.utc)
    issuances = db.query(EquipmentIssuance).filter(EquipmentIssuance.member_id == current_user.id).all()
    
    # Auto-expire overdue issuances
    updated = False
    for iss in issuances:
        if iss.status == "ISSUED" and iss.expected_return_at and iss.expected_return_at.replace(tzinfo=timezone.utc) < now:
            iss.status = "EXPIRED"
            equip = db.query(Equipment).filter(Equipment.id == iss.equipment_id).first()
            if equip:
                equip.available_quantity += iss.quantity
            updated = True
    
    if updated:
        db.commit()
        issuances = db.query(EquipmentIssuance).filter(EquipmentIssuance.member_id == current_user.id).all()
        
    return issuances

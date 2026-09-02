from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.entities import Notification, User
from app.schemas.schemas import NotificationCreate, NotificationResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
def get_user_notifications(
    unread_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get notifications for the logged-in user.
    """
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    return query.order_by(Notification.created_at.desc()).all()

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a notification as read.
    """
    notif = db.query(Notification).filter(
        (Notification.id == notification_id) & (Notification.user_id == current_user.id)
    ).first()
    
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

@router.post("/send", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    notif_in: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Internal / Admin endpoint to trigger in-app notification.
    """
    db_notif = Notification(**notif_in.model_dump())
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

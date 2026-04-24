from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from dependencies import get_current_user, require_admin, CurrentUser
from models.setting import SystemSetting
from schemas.admin import SettingResponse, SettingUpdate

router = APIRouter()


@router.get("/", response_model=list[SettingResponse])
def list_settings(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    return db.query(SystemSetting).order_by(SystemSetting.setting_key).all()


@router.get("/public", response_model=list[SettingResponse])
def public_settings(db: Session = Depends(get_db)):
    return db.query(SystemSetting).filter(SystemSetting.is_public == 1).all()


@router.get("/{key}", response_model=SettingResponse)
def get_setting(
    key: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    s = db.query(SystemSetting).filter(SystemSetting.setting_key == key).first()
    if not s:
        raise HTTPException(status_code=404, detail=f"Setting '{key}' not found")
    if not s.is_public:
        require_admin(current_user)
    return s


@router.put("/{key}", response_model=SettingResponse)
def update_setting(
    key: str,
    payload: SettingUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    s = db.query(SystemSetting).filter(SystemSetting.setting_key == key).first()
    if not s:
        raise HTTPException(status_code=404, detail=f"Setting '{key}' not found")
    s.setting_value = payload.setting_value
    db.commit()
    db.refresh(s)
    return s

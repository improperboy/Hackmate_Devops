from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from dependencies import get_current_user, require_admin, CurrentUser
from models.theme import Theme
from schemas.admin import ThemeCreate, ThemeUpdate, ThemeResponse

router = APIRouter()


@router.get("/", response_model=list[ThemeResponse])
def list_themes(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    return db.query(Theme).order_by(Theme.name).all()


@router.get("/{theme_id}", response_model=ThemeResponse)
def get_theme(
    theme_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    theme = db.query(Theme).filter(Theme.id == theme_id).first()
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    return theme


@router.post("/", response_model=ThemeResponse, status_code=201)
def create_theme(
    payload: ThemeCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    if db.query(Theme).filter(Theme.name == payload.name).first():
        raise HTTPException(status_code=409, detail="Theme name already exists")
    theme = Theme(**payload.model_dump())
    db.add(theme)
    db.commit()
    db.refresh(theme)
    return theme


@router.put("/{theme_id}", response_model=ThemeResponse)
def update_theme(
    theme_id: int,
    payload: ThemeUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    theme = db.query(Theme).filter(Theme.id == theme_id).first()
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(theme, field, value)
    db.commit()
    db.refresh(theme)
    return theme


@router.delete("/{theme_id}", status_code=204)
def delete_theme(
    theme_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    theme = db.query(Theme).filter(Theme.id == theme_id).first()
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")
    db.delete(theme)
    db.commit()

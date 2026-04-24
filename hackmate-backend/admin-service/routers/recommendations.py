from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import text
from sqlalchemy.orm import Session
from db.database import get_db
from dependencies import get_current_user, require_admin, CurrentUser
from models.venue import MentorRecommendation
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()


class RecommendationResponse(BaseModel):
    id: int
    participant_id: int
    mentor_id: int
    match_score: str
    skill_match_details: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── List recommendations ───────────────────────────────────────────────────

@router.get("/", response_model=list[RecommendationResponse])
def list_recommendations(
    participant_id: int | None = Query(None),
    mentor_id: int | None = Query(None),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    q = db.query(MentorRecommendation)
    if participant_id:
        q = q.filter(MentorRecommendation.participant_id == participant_id)
    if mentor_id:
        q = q.filter(MentorRecommendation.mentor_id == mentor_id)
    return q.order_by(MentorRecommendation.match_score.desc()).all()


# ── Generate recommendations ───────────────────────────────────────────────

@router.post("/generate", status_code=status.HTTP_201_CREATED)
def generate_recommendations(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    """
    Skill-based mentor-participant matching.
    Matches participants to mentors using shared tech_stack keywords.
    Score = (shared skills / total unique skills) * 100
    """
    require_admin(current_user)

    # Clear old recommendations
    db.execute(text("DELETE FROM mentor_recommendations"))
    db.commit()

    participants = db.execute(text(
        "SELECT id, tech_stack FROM users WHERE role='participant' AND tech_stack IS NOT NULL AND tech_stack != ''"
    )).fetchall()

    mentors = db.execute(text(
        "SELECT id, tech_stack FROM users WHERE role='mentor' AND tech_stack IS NOT NULL AND tech_stack != ''"
    )).fetchall()

    created = 0
    for participant in participants:
        p_skills = {s.strip().lower() for s in (participant[1] or "").split(",") if s.strip()}
        if not p_skills:
            continue

        best_matches = []
        for mentor in mentors:
            m_skills = {s.strip().lower() for s in (mentor[1] or "").split(",") if s.strip()}
            if not m_skills:
                continue

            shared = p_skills & m_skills
            total = p_skills | m_skills
            score = round((len(shared) / len(total)) * 100, 2) if total else 0.0

            if score > 0:
                best_matches.append((mentor[0], score, list(shared)))

        # Keep top 3 matches per participant
        best_matches.sort(key=lambda x: x[1], reverse=True)
        for mentor_id, score, shared_skills in best_matches[:3]:
            import json
            rec = MentorRecommendation(
                participant_id=participant[0],
                mentor_id=mentor_id,
                match_score=str(score),
                skill_match_details=json.dumps({"shared_skills": shared_skills}),
            )
            db.add(rec)
            created += 1

    db.commit()
    return {"message": f"Generated {created} recommendations"}


# ── Get recommendations for a participant ──────────────────────────────────

@router.get("/participant/{participant_id}", response_model=list[RecommendationResponse])
def recommendations_for_participant(
    participant_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    return (
        db.query(MentorRecommendation)
        .filter(MentorRecommendation.participant_id == participant_id)
        .order_by(MentorRecommendation.match_score.desc())
        .all()
    )


# ── Delete a recommendation ────────────────────────────────────────────────

@router.delete("/{rec_id}", status_code=204)
def delete_recommendation(
    rec_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    require_admin(current_user)
    rec = db.query(MentorRecommendation).filter(MentorRecommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    db.delete(rec)
    db.commit()

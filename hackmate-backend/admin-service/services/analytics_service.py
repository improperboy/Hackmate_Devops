from datetime import datetime, timedelta
from sqlalchemy import text
from sqlalchemy.orm import Session


def get_dashboard_stats(db: Session) -> dict:
    def count(query: str) -> int:
        try:
            return db.execute(text(query)).scalar() or 0
        except Exception:
            db.rollback()
            return 0

    return {
        "total_users":            count("SELECT COUNT(*) FROM users"),
        "total_teams":            count("SELECT COUNT(*) FROM teams"),
        "pending_teams":          count("SELECT COUNT(*) FROM teams WHERE status='pending'"),
        "approved_teams":         count("SELECT COUNT(*) FROM teams WHERE status='approved'"),
        "total_submissions":      count("SELECT COUNT(*) FROM submissions"),
        "open_support_requests":  count("SELECT COUNT(*) FROM support_messages WHERE status='open'"),
        "total_mentors":          count("SELECT COUNT(*) FROM users WHERE role='mentor'"),
        "total_volunteers":       count("SELECT COUNT(*) FROM users WHERE role='volunteer'"),
        "total_participants":     count("SELECT COUNT(*) FROM users WHERE role='participant'"),
        "assigned_mentors":       count("SELECT COUNT(DISTINCT mentor_id) FROM mentor_assignments"),
        "assigned_volunteers":    count("SELECT COUNT(DISTINCT volunteer_id) FROM volunteer_assignments"),
    }


def get_daily_activity(db: Session, days: int = 7) -> list[dict]:
    result = []
    for i in range(days - 1, -1, -1):
        dt = datetime.utcnow() - timedelta(days=i)
        date = dt.strftime("%Y-%m-%d")
        label = dt.strftime("%b") + " " + str(dt.day)

        users = db.execute(
            text("SELECT COUNT(*) FROM users WHERE DATE(created_at) = :d"), {"d": date}
        ).scalar() or 0
        teams = db.execute(
            text("SELECT COUNT(*) FROM teams WHERE DATE(created_at) = :d"), {"d": date}
        ).scalar() or 0
        submissions = db.execute(
            text("SELECT COUNT(*) FROM submissions WHERE DATE(submitted_at) = :d"), {"d": date}
        ).scalar() or 0

        result.append({"date": date, "label": label, "users": users, "teams": teams, "submissions": submissions})
    return result


def get_role_distribution(db: Session) -> dict:
    rows = db.execute(text("SELECT role, COUNT(*) as cnt FROM users GROUP BY role")).fetchall()
    return {row[0]: row[1] for row in rows}


def get_team_status_distribution(db: Session) -> dict:
    rows = db.execute(text("SELECT status, COUNT(*) as cnt FROM teams GROUP BY status")).fetchall()
    return {row[0]: row[1] for row in rows}


def get_avg_scores_per_round(db: Session) -> list[dict]:
    try:
        rows = db.execute(text("""
            SELECT mr.round_name, ROUND(AVG(s.score), 2) as avg_score
            FROM scores s
            JOIN mentoring_rounds mr ON s.round_id = mr.id
            GROUP BY mr.id, mr.round_name, mr.start_time
            ORDER BY mr.start_time
        """)).fetchall()
        return [{"round_name": r[0], "avg_score": float(r[1])} for r in rows]
    except Exception as e:
        db.rollback()
        return []


def get_top_tech_stacks(db: Session, limit: int = 10) -> list[dict]:
    rows = db.execute(text("""
        SELECT tech_stack FROM users
        WHERE tech_stack IS NOT NULL AND tech_stack != ''
        UNION ALL
        SELECT tech_skills AS tech_stack FROM teams
        WHERE tech_skills IS NOT NULL AND tech_skills != ''
        UNION ALL
        SELECT tech_stack FROM submissions
        WHERE tech_stack IS NOT NULL AND tech_stack != ''
    """)).fetchall()

    from collections import Counter
    counter: Counter = Counter()
    for row in rows:
        for skill in (row[0] or "").split(","):
            s = skill.strip()
            if s:
                counter[s] += 1

    return [{"skill": k, "count": v} for k, v in counter.most_common(limit)]


def get_teams_per_location(db: Session) -> list[dict]:
    try:
        rows = db.execute(text("""
            SELECT f.floor_number, r.room_number, COUNT(t.id) as team_count
            FROM teams t
            JOIN floors f ON t.floor_id = f.id
            JOIN rooms r ON t.room_id = r.id
            WHERE t.status = 'approved'
            GROUP BY f.floor_number, r.room_number
            ORDER BY f.floor_number, r.room_number
        """)).fetchall()
        return [{"floor": r[0], "room": r[1], "team_count": r[2]} for r in rows]
    except Exception as e:
        db.rollback()
        return []

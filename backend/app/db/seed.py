from app.db.session import SessionLocal
from app.models.category import Category
from app.models.technique import Technique
from sqlalchemy.orm import Session

# (category_id, category_name, [(technique_id, technique_name), ...])
# List order becomes the `position` of each category and technique.
CATALOG: list[tuple[str, str, list[tuple[str, str]]]] = [
    (
        "standing",
        "Standing",
        [
            ("grip-fighting", "Grip Fighting"),
            ("balance-posture", "Balance & Posture"),
            ("takedown-entries", "Takedown Entries"),
            ("double-leg", "Double Leg"),
            ("single-leg", "Single Leg"),
            ("sprawl", "Sprawl"),
        ],
    ),
    (
        "top-positions",
        "Top Positions",
        [
            ("closed-guard-top", "Closed Guard (Top)"),
            ("half-guard-top", "Half Guard (Top)"),
            ("side-control", "Side Control"),
            ("mount", "Mount"),
            ("back-control", "Back Control"),
        ],
    ),
    (
        "bottom-positions",
        "Bottom Positions",
        [
            ("closed-guard-bottom", "Closed Guard (Bottom)"),
            ("open-guard", "Open Guard"),
            ("half-guard-bottom", "Half Guard (Bottom)"),
            ("butterfly-guard", "Butterfly Guard"),
            ("dlr", "De La Riva"),
        ],
    ),
    (
        "escapes",
        "Escapes",
        [
            ("mount-escape", "Mount Escape"),
            ("side-control-escape", "Side Control Escape"),
            ("back-escape", "Back Escape"),
            ("turtle-defence", "Turtle Defence"),
        ],
    ),
    (
        "submissions",
        "Submissions",
        [
            ("armbar-guard", "Armbar (Guard)"),
            ("armbar-mount", "Armbar (Mount)"),
            ("triangle", "Triangle"),
            ("kimura", "Kimura"),
            ("americana", "Americana"),
            ("guillotine", "Guillotine"),
            ("rear-naked-choke", "Rear Naked Choke"),
            ("cross-collar-choke", "Cross Collar Choke"),
        ],
    ),
    (
        "passing",
        "Passing",
        [
            ("knee-cut", "Knee Cut Pass"),
            ("torreando", "Torreando Pass"),
            ("smash-pass", "Smash Pass"),
        ],
    ),
    (
        "sweeps",
        "Sweeps",
        [
            ("scissor-sweep", "Scissor Sweep"),
            ("pendulum-sweep", "Pendulum Sweep"),
            ("hip-bump-sweep", "Hip Bump Sweep"),
            ("butterfly-sweep", "Butterfly Sweep"),
            ("tripod-sweep", "Tripod Sweep (DLR)"),
        ],
    ),
    (
        "concepts",
        "Concepts",
        [
            ("frames", "Frames"),
            ("underhooks", "Underhooks"),
            ("base-balance", "Base & Balance"),
            ("pressure", "Pressure"),
            ("kuzushi", "Kuzushi (Off Balancing)"),
            ("timing", "Timing"),
        ],
    ),
]


def seed(db: Session) -> tuple[int, int]:
    """Upsert every category and technique. Returns (categories, techniques)."""
    category_count = 0
    technique_count = 0

    for cat_pos, (cat_id, cat_name, _techniques) in enumerate(CATALOG):
        db.merge(Category(id=cat_id, name=cat_name, position=cat_pos))
        category_count += 1

    db.flush()

    for cat_id, _cat_name, techniques in CATALOG:
        for tech_pos, (tech_id, tech_name) in enumerate(techniques):
            db.merge(
                Technique(
                    id=tech_id,
                    name=tech_name,
                    category_id=cat_id,
                    position=tech_pos,
                )
            )
            technique_count += 1

    db.commit()
    return category_count, technique_count


def main() -> None:
    db = SessionLocal()
    try:
        categories, techniques = seed(db)
        print(f"Seeded {categories} categories and {techniques} techniques.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
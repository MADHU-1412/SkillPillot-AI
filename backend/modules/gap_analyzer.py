import json
import os
from typing import List, Dict

WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "../data/skill_weights.json")

# Ensure the weights path exists or handle gracefully
if os.path.exists(WEIGHTS_PATH):
    with open(WEIGHTS_PATH) as f:
        SKILL_WEIGHTS: Dict[str, int] = json.load(f)
else:
    SKILL_WEIGHTS = {}

DEFAULT_WEIGHT = 5


def _match(skill_lower: str, user_set: set) -> bool:
    return any(skill_lower in u or u in skill_lower for u in user_set)


def analyze_gap(user_skills: List[str], jd_skills: List[str]) -> Dict:
    user_lower = {s.lower() for s in user_skills}

    matched = []
    missing_weighted = []

    for skill in jd_skills:
        weight = SKILL_WEIGHTS.get(skill, DEFAULT_WEIGHT)
        if _match(skill.lower(), user_lower):
            matched.append({"skill": skill, "importance": weight})
        else:
            missing_weighted.append({"skill": skill, "importance": weight})

    # Sort missing by importance descending — highest market demand first
    missing_weighted.sort(key=lambda x: x["importance"], reverse=True)
    priority_gap = [s["skill"] for s in missing_weighted[:3]]

    total = len(jd_skills)
    weighted_score = sum(s["importance"] for s in matched)
    max_score = sum(SKILL_WEIGHTS.get(s, DEFAULT_WEIGHT) for s in jd_skills)
    match_score = round((weighted_score / max_score) * 100) if max_score > 0 else 0

    return {
        "matched_skills": [s["skill"] for s in matched],
        "missing_skills": missing_weighted,   # [{skill, importance}] sorted by demand
        "priority_gap": priority_gap,         # top 3 to learn first
        "match_score": match_score,           # weighted, not just count-based
        "total_required": total,
    }

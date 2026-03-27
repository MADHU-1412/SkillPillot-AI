import json
import os
from typing import Dict

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/market_data.json")

# Ensure data path exists
if os.path.exists(DATA_PATH):
    with open(DATA_PATH) as f:
        MARKET_DATA: Dict = json.load(f)
else:
    MARKET_DATA = {}

DEFAULT = {
    "avg_salary": "₹8-14 LPA",
    "demand_score": 72,
    "yoy_growth": "+18%",
    "top_companies": ["TCS", "Infosys", "Wipro"],
    "trending_skills": ["AI/ML", "Cloud", "DevOps"],
    "open_roles": "5,000+",
}


def get_market_intel(target_role: str) -> Dict:
    return MARKET_DATA.get(target_role, DEFAULT)

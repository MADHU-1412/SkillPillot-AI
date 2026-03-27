import json
import os
import pickle
import numpy as np
from typing import Dict, List
from sentence_transformers import SentenceTransformer
import faiss

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/jd_dataset.json")
CACHE_PATH = os.path.join(os.path.dirname(__file__), "../cache/embeddings.pkl")

model = SentenceTransformer("all-MiniLM-L6-v2")
_index = None
_jd_data = None


def _load_or_build_index():
    global _index, _jd_data
    if not os.path.exists(DATA_PATH):
      _jd_data = []
      _index = faiss.IndexFlatIP(384) # Default dimensionality for this model
      return

    with open(DATA_PATH) as f:
        _jd_data = json.load(f)

    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "rb") as f:
            _index = pickle.load(f)
        return

    texts = [jd["description"] for jd in _jd_data]
    embeddings = model.encode(texts, convert_to_numpy=True)
    embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)

    dim = embeddings.shape[1]
    _index = faiss.IndexFlatIP(dim)
    _index.add(embeddings)

    os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
    with open(CACHE_PATH, "wb") as f:
        pickle.dump(_index, f)


def retrieve_jd_insights(target_role: str, top_k: int = 5) -> Dict:
    """
    Returns required_skills AND trending_skills from top matching JDs.
    This is the Market Intelligence Engine — not just retrieval.
    """
    if _index is None:
        _load_or_build_index()

    if not _jd_data:
      return {"required_skills": [], "trending_skills": []}

    query_vec = model.encode([target_role], convert_to_numpy=True)
    query_vec = query_vec / np.linalg.norm(query_vec)
    _, indices = _index.search(query_vec, top_k)

    all_skills: Dict[str, int] = {}   # skill -> frequency across top JDs
    trending: List[str] = []

    for idx in indices[0]:
        if idx < len(_jd_data):
            jd = _jd_data[idx]
            for skill in jd.get("required_skills", []):
                all_skills[skill] = all_skills.get(skill, 0) + 1
            trending.extend(jd.get("trending_skills", []))

    # Most frequently required across top JDs = highest market signal
    sorted_skills = sorted(all_skills, key=all_skills.get, reverse=True)
    unique_trending = list(dict.fromkeys(trending))[:5]

    return {
        "required_skills": sorted_skills,
        "trending_skills": unique_trending,
    }

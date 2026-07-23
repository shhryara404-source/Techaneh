#!/usr/bin/env python3
"""Create current, source-dated bilingual monthly buying guides."""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from typing import Any

from content_core import ROOT, append_article, draft_article, load_articles, research_topic

CONFIG_FILE = ROOT / "config" / "buying-topics.json"


def already_created(slug: str, month: str) -> bool:
    return any(item.get("guideMonth") == month and item.get("guideTopic") == slug for item in load_articles())


def main() -> int:
    config = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    month = datetime.now(timezone.utc).strftime("%Y-%m")
    batch = max(1, min(4, int(os.getenv("MONTHLY_GUIDE_BATCH_SIZE", "2"))))
    minimum_score = int(os.getenv("MIN_EDITORIAL_SCORE", "85"))
    created = 0
    for topic in config.get("topics", []):
        if created >= batch or already_created(topic["slug"], month):
            continue
        query = f"{topic['query']} {month}"
        evidence = research_topic(query, max_results=10)
        generated = draft_article(
            mode="monthly-buying-guide",
            evidence=evidence,
            brief=(
                f"Build the {month} edition of {topic['en']}. Use current, source-dated evidence. "
                "Start with buyer profiles and evaluation criteria, then offer conditional recommendations. "
                "Do not present regional prices as universal and do not recommend an item from an unsupported claim."
            ),
            category_choices=[topic.get("category", "BuyingGuide"), "BuyingGuide"],
        )
        if int(generated.get("editorial_score", 0)) < minimum_score:
            raise ValueError("Buying guide did not meet the editorial threshold")
        item = append_article(
            generated=generated,
            mode="monthly-buying-guide",
            metadata={"contentType": "buying-guide", "guideMonth": month, "guideTopic": topic["slug"]},
        )
        print(f"Created monthly guide #{item['id']}: {topic['slug']}")
        created += 1
    print(f"Created {created} monthly buying guide(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

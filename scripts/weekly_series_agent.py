#!/usr/bin/env python3
"""Publish the next installment of a bilingual weekly educational series."""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from content_core import ROOT, append_article, draft_article, load_articles, research_topic

CONFIG_FILE = ROOT / "config" / "series.json"


def next_lesson(series: dict[str, Any]) -> tuple[int, dict[str, Any]] | None:
    existing_parts = {
        int((item.get("series") or {}).get("part", 0))
        for item in load_articles()
        if (item.get("series") or {}).get("slug") == series["slug"]
    }
    for index, lesson in enumerate(series.get("lessons", []), start=1):
        if index not in existing_parts:
            return index, lesson
    return None


def main() -> int:
    config = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    minimum_score = int(os.getenv("MIN_EDITORIAL_SCORE", "84"))
    for series in config.get("series", []):
        pending = next_lesson(series)
        if not pending:
            continue
        part, lesson = pending
        evidence = research_topic(str(lesson["query"]), max_results=8)
        generated = draft_article(
            mode="weekly-series",
            evidence=evidence,
            brief=(
                f"Create part {part} of {len(series['lessons'])} in the series {series['title']['en']}. "
                f"Lesson: {lesson['en']}. Teach from first principles, include runnable examples where appropriate, "
                "common mistakes, a compact recap, and one safe practice exercise."
            ),
            category_choices=[series.get("category", "Programming")],
            series={
                "slug": series["slug"],
                "title": series["title"],
                "part": part,
                "total": len(series["lessons"]),
                "lesson": lesson,
            },
        )
        if int(generated.get("editorial_score", 0)) < minimum_score:
            raise ValueError("Weekly lesson did not meet the editorial threshold")
        item = append_article(
            generated=generated,
            mode="weekly-series",
            metadata={
                "contentType": "series",
                "series": {
                    "slug": series["slug"],
                    "title": series["title"],
                    "part": part,
                    "total": len(series["lessons"]),
                },
            },
        )
        print(f"Created weekly series article #{item['id']}, part {part}")
        return 0
    print("All configured series are complete. Add a new series to config/series.json.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

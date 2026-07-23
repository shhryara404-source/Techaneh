#!/usr/bin/env python3
"""Create source-grounded bilingual technology news articles on a schedule."""
from __future__ import annotations

import json
import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import feedparser
from dateutil import parser as date_parser

from ai_providers import web_search
from content_core import ROOT, append_article, draft_article, fetch_page_excerpt, load_articles

CONFIG_FILE = ROOT / "config" / "sources.json"


def parse_date(entry: Any) -> datetime:
    for field in ("published", "updated", "created"):
        value = entry.get(field)
        if value:
            try:
                dt = date_parser.parse(str(value))
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                return dt.astimezone(timezone.utc)
            except Exception:
                pass
    return datetime.now(timezone.utc)


def tokens(text: str) -> set[str]:
    return {x for x in re.findall(r"[a-z0-9]{3,}", text.lower()) if x not in {"the", "and", "for", "with", "from", "that", "this"}}


def gather_candidates(config: dict[str, Any]) -> list[dict[str, Any]]:
    existing_urls = {str(url) for article in load_articles() for url in (article.get("sources") or [])}
    cutoff = datetime.now(timezone.utc) - timedelta(hours=int(config.get("max_feed_age_hours", 72)))
    candidates: list[dict[str, Any]] = []
    for feed in config.get("feeds", []):
        parsed = feedparser.parse(feed["url"], agent="TechanehEditorialBot/4.0")
        for entry in parsed.entries[:24]:
            url = str(entry.get("link") or "").strip()
            title = re.sub(r"\s+", " ", str(entry.get("title") or "")).strip()
            if not url.startswith("https://") or not title or url in existing_urls:
                continue
            published = parse_date(entry)
            if published < cutoff:
                continue
            candidates.append({
                "title": title,
                "url": url,
                "summary": re.sub(r"<[^>]+>", " ", str(entry.get("summary") or ""))[:2500],
                "published": published,
                "source": str(feed.get("name") or urlparse(url).netloc),
                "category": str(feed.get("category") or "Technology"),
            })
    candidates.sort(key=lambda x: x["published"], reverse=True)
    return candidates[: int(config.get("max_candidates", 18))]


def independent_evidence(candidate: dict[str, Any], max_results: int = 7) -> list[dict[str, str]]:
    primary_content = fetch_page_excerpt(candidate["url"], 8000) or candidate.get("summary", "")
    evidence = [{"title": candidate["title"], "url": candidate["url"], "content": primary_content[:8000]}]
    primary_domain = urlparse(candidate["url"]).netloc.replace("www.", "")
    seen_domains = {primary_domain}
    search_results = web_search(candidate["title"], max_results=max_results)
    title_tokens = tokens(candidate["title"])
    for item in search_results:
        url = str(item.get("url") or "")
        domain = urlparse(url).netloc.replace("www.", "")
        if not url.startswith("https://") or not domain or domain in seen_domains:
            continue
        overlap = len(title_tokens & tokens(f"{item.get('title','')} {item.get('content','')}"))
        if title_tokens and overlap < max(2, min(5, len(title_tokens) // 4)):
            continue
        content = fetch_page_excerpt(url, 7000) or str(item.get("content") or "")
        if len(content.strip()) < 180:
            continue
        evidence.append({"title": str(item.get("title") or domain), "url": url, "content": content[:7000]})
        seen_domains.add(domain)
        if len(evidence) >= 5:
            break
    return evidence


def main() -> int:
    config = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    interval = max(1, min(24, int(os.getenv("ARTICLE_INTERVAL_HOURS", "1"))))
    if interval > 1 and datetime.now(timezone.utc).hour % interval != 0:
        print(f"Skipping this hourly tick because ARTICLE_INTERVAL_HOURS={interval}.")
        return 0
    batch = max(1, min(2, int(os.getenv("ARTICLE_BATCH_SIZE", "1"))))
    minimum_score = max(1, min(100, int(os.getenv("MIN_EDITORIAL_SCORE", "82"))))
    candidates = gather_candidates(config)
    if not candidates:
        print("No fresh RSS candidates found.")
        return 0

    created = 0
    failures: list[str] = []
    max_attempts = max(batch, min(6, int(os.getenv("MAX_NEWS_CANDIDATE_ATTEMPTS", str(batch)))))
    attempts = 0
    for candidate in candidates:
        if created >= batch or attempts >= max_attempts:
            break
        attempts += 1
        try:
            evidence = independent_evidence(candidate)
            if len({urlparse(x["url"]).netloc for x in evidence}) < 2:
                raise RuntimeError("The topic did not have two independent evidence sources")
            brief = (
                f"Cover this development: {candidate['title']}. Primary publication time: "
                f"{candidate['published'].isoformat()}. Explain what is confirmed, why it matters, practical impact, "
                "limitations, and what readers should watch next. Do not turn rumors into facts."
            )
            generated = draft_article(
                mode="hourly-news",
                evidence=evidence,
                brief=brief,
                category_choices=list(config.get("allowed_categories", [])),
            )
            if int(generated.get("editorial_score", 0)) < minimum_score:
                raise ValueError(f"Editorial score below threshold {minimum_score}")
            item = append_article(
                generated=generated,
                mode="hourly-news",
                metadata={
                    "newsPublishedAt": candidate["published"].isoformat(),
                    "sourceTopic": candidate["title"],
                    "contentType": "news",
                },
            )
            print(f"Created article #{item['id']}: {item['title']['en']}")
            created += 1
        except Exception as exc:
            failures.append(f"{candidate['title']}: {exc}")
            print(f"Skipped candidate: {failures[-1]}")

    if created == 0:
        print("No article passed the evidence and quality gates.")
        for failure in failures[:8]:
            print(" -", failure)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

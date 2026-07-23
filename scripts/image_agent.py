#!/usr/bin/env python3
"""Generate on-brand WebP covers for recent articles using a server-side image API."""
from __future__ import annotations

import base64
import io
import os
import sys
from pathlib import Path
from typing import Any

import requests
from PIL import Image

from content_core import ROOT, load_articles, save_articles, visible_text

OUTPUT_DIR = ROOT / "assets" / "article-covers"


def cloudflare_image(prompt: str) -> bytes:
    account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
    token = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
    if not account_id or not token:
        raise RuntimeError("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required")
    model = os.getenv("CLOUDFLARE_IMAGE_MODEL", "@cf/black-forest-labs/flux-1-schnell")
    response = requests.post(
        f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}",
        headers={"authorization": f"Bearer {token}", "content-type": "application/json"},
        json={"prompt": prompt, "num_steps": 6},
        timeout=180,
    )
    if response.status_code >= 400:
        raise RuntimeError(f"Cloudflare image API error {response.status_code}: {response.text[:1000]}")
    content_type = response.headers.get("content-type", "")
    if content_type.startswith("image/"):
        return response.content
    data = response.json()
    result = data.get("result") or {}
    encoded = result.get("image") if isinstance(result, dict) else None
    if not encoded and isinstance(result, str):
        encoded = result
    if not encoded:
        raise RuntimeError("Cloudflare did not return image data")
    if encoded.startswith("data:image"):
        encoded = encoded.split(",", 1)[1]
    return base64.b64decode(encoded)


def save_webp(raw: bytes, path: Path) -> None:
    image = Image.open(io.BytesIO(raw)).convert("RGB")
    target_ratio = 1200 / 675
    ratio = image.width / image.height
    if ratio > target_ratio:
        width = int(image.height * target_ratio)
        left = (image.width - width) // 2
        image = image.crop((left, 0, left + width, image.height))
    elif ratio < target_ratio:
        height = int(image.width / target_ratio)
        top = (image.height - height) // 2
        image = image.crop((0, top, image.width, top + height))
    image = image.resize((1200, 675), Image.Resampling.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=86, method=6)


def prompt_for(article: dict[str, Any]) -> str:
    title = str((article.get("title") or {}).get("en") or "Technology discovery")
    excerpt = str((article.get("excerpt") or {}).get("en") or "")
    category = str(article.get("category") or "Technology")
    return (
        "Create a premium editorial technology cover image for Techaneh. "
        f"Topic: {title}. Context: {visible_text(excerpt)[:420]}. Category: {category}. "
        "Visual language: futuristic but credible, deep violet, electric cyan and magenta light, "
        "layered liquid-glass surfaces, luminous particles, refined 3D depth, elegant scientific detail, "
        "cinematic wide composition with a calm text-safe area. No words, no letters, no logos, no watermark, "
        "no UI screenshot, no fake product branding, no human face unless essential to the topic. 16:9."
    )


def main() -> int:
    provider = os.getenv("IMAGE_PROVIDER", "cloudflare").strip().lower()
    if provider in {"none", "off", "disabled"}:
        print("Image generation is disabled.")
        return 0
    if provider != "cloudflare":
        raise RuntimeError("This free-first package currently supports IMAGE_PROVIDER=cloudflare or none")

    articles = load_articles()
    maximum = max(1, min(6, int(os.getenv("MAX_IMAGES_PER_RUN", "2"))))
    minimum_score = max(1, min(100, int(os.getenv("MIN_IMAGE_EDITORIAL_SCORE", "92"))))
    generated = 0
    for article in reversed(articles):
        current = str(article.get("image") or "")
        if current and not current.endswith("og-cover.png"):
            continue
        # AI imagery is reserved for important/high-scoring articles and explicit editorial requests.
        if not article.get("importantImage") and int(article.get("score") or 0) < minimum_score:
            continue
        try:
            path = OUTPUT_DIR / f"article-{int(article['id'])}.webp"
            save_webp(cloudflare_image(prompt_for(article)), path)
            article["image"] = f"assets/article-covers/{path.name}"
            article["imageSource"] = "ai-generated-cloudflare"
            generated += 1
            print(f"Generated cover for article #{article['id']}")
        except Exception as exc:
            print(f"Could not generate cover for article #{article.get('id')}: {exc}", file=sys.stderr)
        if generated >= maximum:
            break
    if generated:
        save_articles(articles)
    print(f"Generated {generated} image(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

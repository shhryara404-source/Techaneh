#!/usr/bin/env python3
"""Provider-fallback AI and web-search helpers for Techaneh automation."""
from __future__ import annotations

import json
import os
import re
from typing import Any, Callable

import requests

DEEPSEEK_CHAT = "https://api.deepseek.com/chat/completions"
GITHUB_MODELS_CHAT = "https://models.github.ai/inference/chat/completions"
OPENAI_RESPONSES = "https://api.openai.com/v1/responses"
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def _clean_json(text: str) -> dict[str, Any]:
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.I | re.S)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.S)
        if not match:
            raise
        return json.loads(match.group(0))


def _chat_text(payload: dict[str, Any]) -> str:
    return str((((payload.get("choices") or [{}])[0].get("message") or {}).get("content") or "")).strip()


def _openai_text(payload: dict[str, Any]) -> str:
    if isinstance(payload.get("output_text"), str):
        return payload["output_text"].strip()
    chunks: list[str] = []
    for item in payload.get("output", []):
        for part in item.get("content", []):
            value = part.get("text") or part.get("output_text")
            if isinstance(value, str):
                chunks.append(value)
    return "\n".join(chunks).strip()


def _provider_chain() -> list[str]:
    raw = os.getenv("TEXT_AI_PROVIDERS") or os.getenv("TEXT_AI_PROVIDER") or "deepseek,github_models,openai,gemini"
    return [item.strip().lower() for item in raw.split(",") if item.strip()]


class AIClient:
    """Generate strict JSON with automatic provider fallback."""

    def __init__(self) -> None:
        self.providers = _provider_chain()
        self.last_provider = ""

    def generate_json(self, *, system: str, prompt: str, max_tokens: int = 7000) -> dict[str, Any]:
        methods: dict[str, Callable[..., dict[str, Any]]] = {
            "deepseek": self._deepseek,
            "github_models": self._github_models,
            "openai": self._openai,
            "gemini": self._gemini,
        }
        errors: list[str] = []
        attempted = 0
        for provider in self.providers:
            method = methods.get(provider)
            if not method or not self._configured(provider):
                continue
            attempted += 1
            try:
                result = method(system=system, prompt=prompt, max_tokens=max_tokens)
                self.last_provider = provider
                print(f"AI provider used: {provider}")
                return result
            except Exception as exc:  # fallback is intentional
                errors.append(f"{provider}: {exc}")
                print(f"AI provider unavailable, trying fallback: {provider}: {exc}")
        if attempted == 0:
            raise RuntimeError(
                "No AI provider is configured. Add DEEPSEEK_ARTICLES_API_KEY or allow GitHub Models with GITHUB_TOKEN."
            )
        raise RuntimeError("All AI providers failed: " + " | ".join(errors))

    @staticmethod
    def _configured(provider: str) -> bool:
        if provider == "deepseek":
            return bool(os.getenv("DEEPSEEK_ARTICLES_API_KEY") or os.getenv("DEEPSEEK_API_KEY"))
        if provider == "github_models":
            return bool(os.getenv("GITHUB_TOKEN") or os.getenv("GITHUB_MODELS_TOKEN"))
        if provider == "openai":
            return bool(os.getenv("OPENAI_API_KEY"))
        if provider == "gemini":
            return bool(os.getenv("GEMINI_API_KEY"))
        return False

    def _deepseek(self, *, system: str, prompt: str, max_tokens: int) -> dict[str, Any]:
        key = os.getenv("DEEPSEEK_ARTICLES_API_KEY") or os.getenv("DEEPSEEK_API_KEY")
        response = requests.post(
            DEEPSEEK_CHAT,
            headers={"authorization": f"Bearer {key}", "content-type": "application/json"},
            json={
                "model": os.getenv("DEEPSEEK_MODEL", "deepseek-v4-flash"),
                "messages": [
                    {"role": "system", "content": system + " Output valid JSON only."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
                "max_tokens": max_tokens,
                "stream": False,
                "response_format": {"type": "json_object"},
            },
            timeout=240,
        )
        if response.status_code >= 400:
            raise RuntimeError(f"DeepSeek API error {response.status_code}: {response.text[:1200]}")
        text = _chat_text(response.json())
        if not text:
            raise RuntimeError("DeepSeek returned an empty response")
        return _clean_json(text)

    def _github_models(self, *, system: str, prompt: str, max_tokens: int) -> dict[str, Any]:
        token = os.getenv("GITHUB_TOKEN") or os.getenv("GITHUB_MODELS_TOKEN")
        response = requests.post(
            GITHUB_MODELS_CHAT,
            headers={
                "authorization": f"Bearer {token}",
                "content-type": "application/json",
                "accept": "application/vnd.github+json",
                "x-github-api-version": "2022-11-28",
            },
            json={
                "model": os.getenv("GITHUB_MODELS_MODEL", "openai/gpt-4o-mini"),
                "messages": [
                    {"role": "system", "content": system + " Output valid JSON only."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
                "max_tokens": max_tokens,
                "response_format": {"type": "json_object"},
            },
            timeout=240,
        )
        if response.status_code >= 400:
            raise RuntimeError(f"GitHub Models API error {response.status_code}: {response.text[:1200]}")
        text = _chat_text(response.json())
        if not text:
            raise RuntimeError("GitHub Models returned an empty response")
        return _clean_json(text)

    def _openai(self, *, system: str, prompt: str, max_tokens: int) -> dict[str, Any]:
        key = os.getenv("OPENAI_API_KEY")
        payload: dict[str, Any] = {
            "model": os.getenv("OPENAI_MODEL", "gpt-5-mini"),
            "instructions": system + " Output valid JSON only.",
            "input": prompt,
            "max_output_tokens": max_tokens,
            "store": False,
        }
        response = requests.post(
            OPENAI_RESPONSES,
            headers={"authorization": f"Bearer {key}", "content-type": "application/json"},
            json=payload,
            timeout=240,
        )
        if response.status_code >= 400:
            raise RuntimeError(f"OpenAI API error {response.status_code}: {response.text[:1200]}")
        text = _openai_text(response.json())
        if not text:
            raise RuntimeError("OpenAI returned an empty response")
        return _clean_json(text)

    def _gemini(self, *, system: str, prompt: str, max_tokens: int) -> dict[str, Any]:
        key = os.getenv("GEMINI_API_KEY")
        model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        response = requests.post(
            f"{GEMINI_BASE}/{model}:generateContent",
            headers={"x-goog-api-key": key, "content-type": "application/json"},
            json={
                "systemInstruction": {"parts": [{"text": system}]},
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.2,
                    "maxOutputTokens": max_tokens,
                },
            },
            timeout=240,
        )
        if response.status_code >= 400:
            raise RuntimeError(f"Gemini API error {response.status_code}: {response.text[:1200]}")
        data = response.json()
        parts = (((data.get("candidates") or [{}])[0].get("content") or {}).get("parts") or [])
        text = "\n".join(str(part.get("text") or "") for part in parts).strip()
        if not text:
            raise RuntimeError("Gemini returned an empty response")
        return _clean_json(text)


def _gnews_search(query: str, max_results: int) -> list[dict[str, str]]:
    key = os.getenv("GNEWS_API_KEY")
    if not key:
        return []
    response = requests.get(
        "https://gnews.io/api/v4/search",
        params={"q": query[:200], "lang": "en", "max": min(max_results, 10)},
        headers={"X-Api-Key": key, "accept": "application/json"},
        timeout=45,
    )
    response.raise_for_status()
    return [
        {
            "title": str(item.get("title") or ""),
            "url": str(item.get("url") or ""),
            "content": str(item.get("description") or item.get("content") or "")[:3000],
            "published_at": str(item.get("publishedAt") or ""),
            "provider": "GNews",
        }
        for item in response.json().get("articles", [])
        if item.get("url")
    ][:max_results]


def _tavily_search(query: str, max_results: int, *, keyless: bool = False) -> list[dict[str, str]]:
    key = os.getenv("TAVILY_API_KEY")
    if not key and not keyless:
        return []
    headers = {"content-type": "application/json"}
    if key:
        headers["authorization"] = f"Bearer {key}"
    else:
        headers["X-Tavily-Access-Mode"] = "keyless"
    response = requests.post(
        "https://api.tavily.com/search",
        headers=headers,
        json={
            "query": query[:400],
            "search_depth": "basic",
            "max_results": max_results,
            "include_answer": False,
        },
        timeout=60,
    )
    response.raise_for_status()
    provider = "Tavily" if key else "Tavily Keyless"
    return [
        {
            "title": str(item.get("title") or ""),
            "url": str(item.get("url") or ""),
            "content": str(item.get("content") or "")[:3000],
            "provider": provider,
        }
        for item in response.json().get("results", [])
        if item.get("url")
    ]


def _hacker_news_search(query: str, max_results: int) -> list[dict[str, str]]:
    response = requests.get(
        "https://hn.algolia.com/api/v1/search",
        params={"query": query, "tags": "story", "hitsPerPage": min(max_results, 8)},
        headers={"accept": "application/json"},
        timeout=45,
    )
    if response.status_code >= 400:
        return []
    results: list[dict[str, str]] = []
    for item in response.json().get("hits", []):
        url = str(item.get("url") or item.get("story_url") or "")
        if not url:
            continue
        results.append(
            {
                "title": str(item.get("title") or item.get("story_title") or "Hacker News story"),
                "url": url,
                "content": f"Hacker News · {str(item.get('created_at') or '')[:10]} · {int(item.get('points') or 0)} points",
                "provider": "Hacker News",
            }
        )
    return results[:max_results]


def _search_chain() -> list[str]:
    raw = os.getenv("SEARCH_PROVIDERS") or os.getenv("SEARCH_PROVIDER") or "gnews,tavily,tavily_keyless,hacker_news"
    return [item.strip().lower() for item in raw.split(",") if item.strip()]


def web_search(query: str, max_results: int = 6) -> list[dict[str, str]]:
    """Search with explicit provider fallbacks; no secret is ever exposed to the browser."""
    for provider in _search_chain():
        try:
            if provider == "gnews":
                results = _gnews_search(query, max_results)
            elif provider == "tavily":
                results = _tavily_search(query, max_results)
            elif provider in {"tavily_keyless", "keyless"}:
                results = _tavily_search(query, max_results, keyless=True)
            elif provider in {"hacker_news", "hn"}:
                results = _hacker_news_search(query, max_results)
            else:
                continue
            if results:
                print(f"Search provider used: {provider}")
                return results
        except Exception as exc:
            print(f"Search provider unavailable, trying fallback: {provider}: {exc}")
    return []

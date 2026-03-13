#!/usr/bin/env python3
"""
Fetch current Polymarket data for Elia Seismograph.
Writes seismograph_data.json to repo root.
Run via GitHub Actions every 6 hours, or manually.
"""

import json, os, sys
from datetime import datetime, timezone

try:
    import urllib.request
except ImportError:
    print("ERROR: urllib not available")
    sys.exit(1)

GAMMA_API = "https://gamma-api.polymarket.com"
OUTPUT = "seismograph_data.json"

WATCHED_QUERIES = [
    {"id": "anthropic-pentagon", "terms": ["anthropic", "pentagon"]},
    {"id": "best-ai-model", "terms": ["best", "ai", "model", "march"]},
    {"id": "anthropic-openai-ipo", "terms": ["anthropic", "openai", "ipo"]},
    {"id": "anduril-ipo", "terms": ["anduril", "ipo"]},
    {"id": "sacks-white-house", "terms": ["sacks", "white", "house"]},
]

def fetch_json(url):
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "Elia-Seismograph/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())

def main():
    print("Fetching Polymarket events...")
    events = fetch_json(f"{GAMMA_API}/events?limit=200&active=true&closed=false")
    
    all_markets = []
    for ev in events:
        for m in ev.get("markets", []):
            m["_eventTitle"] = ev.get("title", "")
            m["_eventSlug"] = ev.get("slug", "")
            all_markets.append(m)
    
    print(f"  {len(all_markets)} markets found")
    
    results = {}
    for w in WATCHED_QUERIES:
        for m in all_markets:
            hay = (m.get("question", "") + m.get("_eventTitle", "") + m.get("_eventSlug", "")).lower()
            if all(t in hay for t in w["terms"]):
                yes_price = None
                if m.get("outcomePrices"):
                    try:
                        prices = json.loads(m["outcomePrices"])
                        yes_price = round(float(prices[0]) * 100)
                    except:
                        pass
                results[w["id"]] = {
                    "question": m.get("question", ""),
                    "yes": yes_price,
                    "volume": m.get("volume"),
                    "slug": m.get("_eventSlug", ""),
                }
                print(f"  Matched: {w['id']} -> {yes_price}% (vol: {m.get('volume')})")
                break
    
    # Load previous data for history
    prev = {}
    if os.path.exists(OUTPUT):
        with open(OUTPUT) as f:
            try:
                prev = json.load(f)
            except:
                pass
    
    # Build history
    for rid, rdata in results.items():
        old_hist = prev.get("markets", {}).get(rid, {}).get("history", [])
        if rdata["yes"] is not None:
            old_hist.append({"t": datetime.now(timezone.utc).isoformat(), "p": rdata["yes"]})
        # Keep last 168 entries (7 days at 1/hour)
        rdata["history"] = old_hist[-168:]
    
    output = {
        "updated": datetime.now(timezone.utc).isoformat(),
        "source": "gamma-api.polymarket.com",
        "markets": results,
    }
    
    with open(OUTPUT, "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"Wrote {OUTPUT}")
    for rid, rdata in results.items():
        print(f"  {rid}: {rdata['yes']}%")

if __name__ == "__main__":
    main()

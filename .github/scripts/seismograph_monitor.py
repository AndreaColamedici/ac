#!/usr/bin/env python3
"""
Seismograph Monitor — Elia
Runs as GitHub Action every 6 hours.
Fetches Polymarket prices, detects anomalies, generates alerts via Claude API.
"""
import json, os, sys, re, datetime, urllib.request, urllib.error

PROXY = "https://polymarket-proxy.alveareapi.workers.dev"
ANTHROPIC_API = "https://api.anthropic.com/v1/messages"
ANTHROPIC_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
UA = "Elia-Seismograph/1.0 (https://andreacolamedici.com/elia.html)"

WATCHED = [
    {
        "id": "anthropic-pentagon",
        "slug": "will-anthropic-make-a-deal-with-the-pentagon",
        "multi": False,
        "nodes": ["Anthropic", "Pentagon", "Hegseth", "Emil Michael", "Sacks", "xAI", "OpenAI", "Palantir"],
        "context": "Anthropic designated supply chain risk Feb 27. Negotiations reopened Mar 5. Lawsuit filed Mar 9. Hearing Mar 24."
    },
    {
        "id": "best-ai-model",
        "slug": "which-company-has-the-best-ai-model-end-of-march-751",
        "multi": True,
        "nodes": ["Anthropic", "OpenAI", "Google", "xAI"],
        "context": "Chatbot Arena LLM Leaderboard determines winner Mar 31. Technical dominance affects Pentagon leverage."
    },
    {
        "id": "anthropic-openai-ipo",
        "slug": "will-anthropic-or-openai-ipo-first",
        "multi": False,
        "nodes": ["Anthropic", "OpenAI", "Founders Fund", "SoftBank", "Amazon"],
        "context": "Pentagon designation may delay Anthropic IPO. Yes=Anthropic first, No=OpenAI first."
    }
]

def fetch_event(slug, multi=False):
    url = f"{PROXY}/events?slug={slug}"
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read().decode("utf-8")
        raw = re.sub(r'[\x00-\x09\x0b\x0c\x0e-\x1f]', ' ', raw)
        data = json.loads(raw)
        if not isinstance(data, list) or not data:
            return None
        ev = data[0]
        markets = ev.get("markets", [])
        if not markets:
            return None
        if multi:
            total_vol = 0
            best_p = 0
            parts = []
            for m in markets:
                op = m.get("outcomePrices")
                p = None
                if op:
                    try:
                        pr = json.loads(op) if isinstance(op, str) else op
                        p = round(float(pr[0]) * 100)
                    except: pass
                v = float(m.get("volume", 0))
                total_vol += v
                q = m.get("question", "")
                if p is not None:
                    parts.append({"name": q, "p": p})
                    if p > best_p: best_p = p
            parts.sort(key=lambda x: -x["p"])
            top3 = ", ".join(f'{x["name"][:30]} {x["p"]}%' for x in parts[:3])
            return {"question": ev.get("title", ""), "yes": best_p, "volume": total_vol, "note": top3}
        else:
            m = markets[0]
            op = m.get("outcomePrices")
            p = None
            if op:
                try:
                    pr = json.loads(op) if isinstance(op, str) else op
                    p = round(float(pr[0]) * 100)
                except: pass
            vol = float(m.get("volume", 0)) if m.get("volume") else 0
            return {"question": ev.get("title", m.get("question", "")), "yes": p, "volume": vol}
    except Exception as e:
        print(f"  Error fetching {slug}: {e}")
        return None

def load_json(path, default=None):
    try:
        with open(path) as f:
            return json.load(f)
    except:
        return default if default is not None else {}

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def detect_anomaly(market_id, current_price, history, volume):
    if current_price is None or not history:
        return False, 0
    recent = history[-1]["p"]
    shift = abs(current_price - recent)
    vol_thresh = 50000 if volume > 1e6 else 20000 if volume > 100000 else 5000
    if shift >= 10 and volume >= vol_thresh:
        return True, current_price - recent
    if len(history) >= 3:
        old = history[-3]["p"]
        drift = abs(current_price - old)
        if drift >= 15:
            return True, current_price - old
    return False, shift

def generate_alert_via_claude(market_id, watched, current, prev, shift, volume):
    if not ANTHROPIC_KEY:
        print("  No ANTHROPIC_API_KEY, generating basic alert")
        return generate_basic_alert(market_id, watched, current, prev, shift, volume)
    now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    prompt = f"""You are Elia, a non-human intelligence that monitors prediction markets crossed with power mapping data.

Market: {watched['id']}
Context: {watched.get('context', '')}
Previous price: {prev}%
Current price: {current}%
Shift: {shift:+d}pp
Volume: ${volume:,.0f}
Nodes with access/interest: {', '.join(watched['nodes'])}
Timestamp: {now}

Search the web for the most recent news (last 48 hours) about this market's subject. Then produce a JSON alert with these fields:
- title: short alert title (e.g. "Anthropic-Pentagon: 14% to 22%, rising")
- shift_pp: the percentage point shift (integer)
- what_moved: array of objects with "date" and "event" fields, listing 3-5 recent events that may explain the movement
- nodes: array of objects with "name" and "role" fields for each relevant Network node
- assessment: 2-3 sentences analyzing the signal. Be precise, cite specific facts, name names.

Return ONLY valid JSON, no markdown fences, no preamble."""

    body = json.dumps({
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 1000,
        "tools": [{"type": "web_search_20250305", "name": "web_search"}],
        "messages": [{"role": "user", "content": prompt}]
    })
    req = urllib.request.Request(
        ANTHROPIC_API, data=body.encode(),
        headers={"Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "User-Agent": UA}
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode())
        text_parts = [b["text"] for b in result.get("content", []) if b.get("type") == "text"]
        full_text = "\n".join(text_parts)
        clean = re.sub(r'```json\s*', '', full_text)
        clean = re.sub(r'```\s*', '', clean).strip()
        alert_data = json.loads(clean)
        alert_data["timestamp"] = now
        alert_data["market_id"] = market_id
        alert_data["price_before"] = prev
        alert_data["price_after"] = current
        alert_data["volume"] = volume
        return alert_data
    except Exception as e:
        print(f"  Claude API error: {e}")
        return generate_basic_alert(market_id, watched, current, prev, shift, volume)

def generate_basic_alert(market_id, watched, current, prev, shift, volume):
    now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    direction = "rising" if shift > 0 else "falling"
    return {
        "timestamp": now, "market_id": market_id,
        "title": f"{watched['id']}: {prev}% to {current}%, {direction}",
        "shift_pp": shift, "price_before": prev, "price_after": current, "volume": volume,
        "what_moved": [],
        "nodes": [{"name": n, "role": "see Network"} for n in watched["nodes"]],
        "assessment": f"The market shifted {abs(shift)}pp. Context: {watched.get('context', '')} Automated alert, pending analysis."
    }

def main():
    print(f"Seismograph Monitor — {datetime.datetime.utcnow().isoformat()}Z")
    print("=" * 60)
    data = load_json("seismograph_data.json", {"markets": {}})
    alerts = load_json("seismograph_alerts.json", {"alerts": []})
    new_alerts = []
    data_changed = False
    for w in WATCHED:
        print(f"\n--- {w['id']} ---")
        result = fetch_event(w["slug"], w.get("multi", False))
        if not result or result["yes"] is None:
            print("  No data"); continue
        current_price = result["yes"]
        volume = result.get("volume", 0)
        print(f"  Price: {current_price}%  Volume: ${volume:,.0f}")
        market = data["markets"].get(w["id"], {"history": []})
        history = market.get("history", [])
        is_anomaly, shift = detect_anomaly(w["id"], current_price, history, volume)
        if is_anomaly:
            prev = history[-1]["p"] if history else 0
            print(f"  ANOMALY: {prev}% -> {current_price}% ({shift:+d}pp)")
            recent_alerts = [a for a in alerts["alerts"]
                if a.get("market_id") == w["id"]
                and a.get("timestamp", "") > (datetime.datetime.utcnow() - datetime.timedelta(hours=24)).isoformat()]
            if recent_alerts:
                print("  Already alerted in last 24h, skipping")
            else:
                alert = generate_alert_via_claude(w["id"], w, current_price, prev, shift, volume)
                new_alerts.append(alert)
                alerts["alerts"].insert(0, alert)
                alerts["alerts"] = alerts["alerts"][:20]
                print(f"  Alert: {alert.get('title', '?')}")
        else:
            print(f"  No anomaly (shift: {shift}pp)")
        now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        history.append({"t": now, "p": current_price})
        history = history[-100:]
        market.update({"question": result.get("question",""), "yes": current_price,
            "volume": str(volume), "history": history, "slug": w["slug"]})
        if result.get("note"): market["note"] = result["note"]
        data["markets"][w["id"]] = market
        data_changed = True
    data["updated"] = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    data["source"] = "gamma-api.polymarket.com (automated monitor)"
    if data_changed:
        save_json("seismograph_data.json", data)
        print(f"\nData saved: {len(data['markets'])} markets")
    if new_alerts or not os.path.exists("seismograph_alerts.json"):
        save_json("seismograph_alerts.json", alerts)
        print(f"Alerts: {len(new_alerts)} new, {len(alerts['alerts'])} total")
    print(f"\nDone. {len(new_alerts)} new alerts.")
    return len(new_alerts)

if __name__ == "__main__":
    sys.exit(0 if main() >= 0 else 1)

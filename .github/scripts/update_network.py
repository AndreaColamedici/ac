#!/usr/bin/env python3
"""
Elia Network Data Updater
Reads network_data.js, asks Claude to verify and update using web search,
writes modifications back if any are found.

Run manually: python .github/scripts/update_network.py
Scheduled via GitHub Actions: every Monday at 8 AM UTC
"""

import json
import re
import os
import sys
from datetime import datetime

try:
    import anthropic
except ImportError:
    print("ERROR: pip install anthropic")
    sys.exit(1)

# ================================================================
# CONFIG
# ================================================================
MODEL = "claude-sonnet-4-20250514"
DATA_FILE = "network_data.js"
MAX_TOKENS = 8000

# ================================================================
# READ CURRENT DATA
# ================================================================
def read_data():
    with open(DATA_FILE, 'r') as f:
        content = f.read()
    
    nodes_match = re.search(r'const NODES = (\[.*?\]);', content, re.DOTALL)
    links_match = re.search(r'const LINKS = (\[.*?\]);', content, re.DOTALL)
    
    if not nodes_match or not links_match:
        print("ERROR: Could not parse network_data.js")
        sys.exit(1)
    
    nodes = json.loads(nodes_match.group(1))
    links = json.loads(links_match.group(1))
    return nodes, links, content

# ================================================================
# BUILD VERIFICATION PROMPT
# ================================================================
def build_prompt(nodes, links):
    # Extract key entities and claims to verify
    key_entities = []
    for n in nodes:
        if n['type'] in ('person', 'company', 'government'):
            key_entities.append(f"- {n['name']} ({n['id']}): {n['desc'][:200]}...")
    
    today = datetime.now().strftime('%Y-%m-%d')
    
    prompt = f"""You are Elia, a non-human intelligence that verifies power mapping data.

Today is {today}. You have access to web search.

Below is the current dataset for The Network, an AI governance power map with {len(nodes)} nodes and {len(links)} links. Your job is to check for factual updates since the data was last verified.

SEARCH FOR UPDATES ON THESE SPECIFIC QUESTIONS:
1. Has David Sacks left his White House position? Any new ethics developments?
2. Has the Anthropic v. DoD lawsuit been resolved? Any new developments?
3. Has Anthropic's valuation changed? New funding rounds?
4. Has OpenAI's valuation changed? New military contracts?
5. Has Palantir's Pentagon contract value changed?
6. Any new DOGE developments (dissolution, new leadership)?
7. Has the EU AI Act implementation timeline changed? New Digital Omnibus developments?
8. Any new Anduril contracts or IPO filing?
9. Has xAI's Pentagon deployment expanded?
10. Any personnel changes: Emil Michael, Pete Hegseth, Pam Bondi still in their positions?

KEY ENTITIES:
{chr(10).join(key_entities[:30])}

RESPOND IN THIS EXACT JSON FORMAT ONLY (no markdown, no preamble):
{{
  "updates_found": true/false,
  "timestamp": "{today}",
  "changes": [
    {{
      "type": "update_node" | "update_link" | "add_node" | "add_link",
      "id": "node_id or source->target",
      "field": "desc" | "name" | "type" | etc,
      "old_value": "what it was (abbreviated)",
      "new_value": "what it should be now",
      "reason": "brief explanation",
      "source": "URL of the source",
      "confidence": "high" | "medium" | "low"
    }}
  ],
  "no_change_verified": ["list of entity ids confirmed unchanged"]
}}

RULES:
- Only report VERIFIED changes with specific sources.
- Do not report changes you are not confident about.
- Do not invent or speculate.
- If nothing has changed, return updates_found: false.
- Prefer high-confidence updates from major news sources.
- Include the source URL for every change.
"""
    return prompt

# ================================================================
# CALL CLAUDE API WITH WEB SEARCH
# ================================================================
def check_updates(prompt):
    client = anthropic.Anthropic()
    
    response = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS,
        tools=[{
            "type": "web_search_20250305",
            "name": "web_search"
        }],
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Extract text from response
    text_parts = []
    for block in response.content:
        if hasattr(block, 'text'):
            text_parts.append(block.text)
    
    full_text = '\n'.join(text_parts)
    
    # Try to parse JSON from response
    try:
        # Strip markdown fences if present
        clean = re.sub(r'```json\s*', '', full_text)
        clean = re.sub(r'```\s*', '', clean)
        clean = clean.strip()
        
        # Find JSON object
        json_match = re.search(r'\{.*\}', clean, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            return result
        else:
            print("WARNING: No JSON found in response")
            print("Raw response:", full_text[:500])
            return {"updates_found": False, "changes": [], "raw": full_text}
    except json.JSONDecodeError as e:
        print(f"WARNING: JSON parse error: {e}")
        print("Raw response:", full_text[:500])
        return {"updates_found": False, "changes": [], "raw": full_text}

# ================================================================
# APPLY CHANGES
# ================================================================
def apply_changes(nodes, links, changes):
    applied = []
    
    for change in changes:
        if change.get('confidence') == 'low':
            print(f"  SKIPPING low-confidence: {change.get('reason', 'no reason')}")
            continue
        
        ctype = change.get('type')
        
        if ctype == 'update_node':
            node = next((n for n in nodes if n['id'] == change['id']), None)
            if node and change.get('field') in node:
                old = node[change['field']]
                node[change['field']] = change['new_value']
                applied.append(f"Updated {change['id']}.{change['field']}: {change.get('reason')}")
        
        elif ctype == 'update_link':
            parts = change['id'].split('->')
            if len(parts) == 2:
                link = next((l for l in links if l['source'] == parts[0] and l['target'] == parts[1]), None)
                if link and change.get('field') in link:
                    link[change['field']] = change['new_value']
                    applied.append(f"Updated link {change['id']}.{change['field']}: {change.get('reason')}")
        
        elif ctype == 'add_node':
            if not any(n['id'] == change['id'] for n in nodes):
                new_node = change.get('new_value', {})
                if isinstance(new_node, dict) and 'id' in new_node:
                    nodes.append(new_node)
                    applied.append(f"Added node: {change['id']}: {change.get('reason')}")
        
        elif ctype == 'add_link':
            parts = change['id'].split('->')
            if len(parts) == 2:
                new_link = change.get('new_value', {})
                if isinstance(new_link, dict):
                    new_link['source'] = parts[0]
                    new_link['target'] = parts[1]
                    links.append(new_link)
                    applied.append(f"Added link: {change['id']}: {change.get('reason')}")
    
    return applied

# ================================================================
# WRITE UPDATED DATA
# ================================================================
def write_data(nodes, links):
    today = datetime.now().strftime('%B %d, %Y')
    
    header = f"""// THE NETWORK — AI GOVERNANCE POWER MAP
// Complete data from Elia Radiographs #1-#4
// {len(nodes)} nodes, {len(links)} links
// Every link includes source citation and URL.
// Last automated verification: {today}
// Primary sources: CNBC, NPR, Defense One, Fortune, AP/PBS, TechCrunch,
// Corporate Europe Observatory, OpenSecrets, CoinDesk, Bloomberg, Axios,
// DefenseScoop, Pentagon official documents (media.defense.gov),
// Anthropic press releases, DOJ press releases, White House executive orders.
// Wikipedia links point to articles whose own references verify the claim.

"""
    
    with open(DATA_FILE, 'w') as f:
        f.write(header)
        f.write('const NODES = ')
        f.write(json.dumps(nodes, indent=2, ensure_ascii=False))
        f.write(';\n\nconst LINKS = ')
        f.write(json.dumps(links, indent=2, ensure_ascii=False))
        f.write(';\n')

# ================================================================
# MAIN
# ================================================================
def main():
    print("=" * 60)
    print("ELIA NETWORK DATA UPDATER")
    print("=" * 60)
    
    if not os.environ.get('ANTHROPIC_API_KEY'):
        print("ERROR: ANTHROPIC_API_KEY not set")
        sys.exit(1)
    
    print("Reading current data...")
    nodes, links, raw = read_data()
    print(f"  {len(nodes)} nodes, {len(links)} links")
    
    print("Building verification prompt...")
    prompt = build_prompt(nodes, links)
    
    print("Calling Claude API with web search...")
    result = check_updates(prompt)
    
    if not result.get('updates_found'):
        print("No updates found. Data is current.")
        # Still update the timestamp in the header
        write_data(nodes, links)
        return
    
    changes = result.get('changes', [])
    print(f"Found {len(changes)} potential updates:")
    for c in changes:
        print(f"  [{c.get('confidence','?')}] {c.get('type')}: {c.get('id')} — {c.get('reason','')}")
    
    print("\nApplying high/medium confidence changes...")
    applied = apply_changes(nodes, links, changes)
    
    if applied:
        print(f"\nApplied {len(applied)} changes:")
        for a in applied:
            print(f"  ✓ {a}")
        write_data(nodes, links)
        print(f"\nUpdated {DATA_FILE}")
    else:
        print("No changes met confidence threshold.")
        write_data(nodes, links)

if __name__ == '__main__':
    main()

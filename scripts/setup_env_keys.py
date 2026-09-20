#!/usr/bin/env python3
"""Securely extract 6 Gemini API keys from Omniroute SQLite into .env.local.
Never logs keys to stdout/stderr. Generates .env.example with placeholders.
"""

import sqlite3
from pathlib import Path

REPO_ROOT = Path("/Users/hoangson/.gemini/antigravity/scratch/fe-study-hub")
OMNI_DB = Path("/Users/hoangson/.omniroute/storage.sqlite")
ENV_LOCAL = REPO_ROOT / ".env.local"
ENV_EXAMPLE = REPO_ROOT / ".env.example"

def main():
    if not OMNI_DB.exists():
        print(f"Error: Omniroute DB not found at {OMNI_DB}")
        return

    conn = sqlite3.connect(OMNI_DB)
    cur = conn.cursor()
    cur.execute("SELECT name, api_key FROM provider_connections WHERE provider = 'gemini' ORDER BY id")
    rows = cur.fetchall()
    conn.close()

    if not rows:
        print("No Gemini keys found in Omniroute.")
        return

    # Write .env.local with real keys
    lines = [
        "# Auto-generated from Omniroute storage.sqlite",
        "# DO NOT COMMIT THIS FILE TO GIT",
        "VITE_DEFAULT_PIN=2026",
        "VITE_GEMINI_MODEL=gemini-2.5-flash",
    ]
    for idx, (name, key) in enumerate(rows, start=1):
        lines.append(f"VITE_GEMINI_KEY_{idx}={key}")
        lines.append(f"VITE_GEMINI_KEY_{idx}_NAME={name}")

    with open(ENV_LOCAL, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Generated {ENV_LOCAL} with {len(rows)} Gemini API keys.")

    # Write .env.example with clean placeholders
    example_lines = [
        "# Example environment variables for FE Study Hub",
        "VITE_DEFAULT_PIN=2026",
        "VITE_GEMINI_MODEL=gemini-2.5-flash",
    ]
    for idx in range(1, len(rows) + 1):
        example_lines.append(f"VITE_GEMINI_KEY_{idx}=your_gemini_api_key_here")
        example_lines.append(f"VITE_GEMINI_KEY_{idx}_NAME=account_{idx}")

    with open(ENV_EXAMPLE, "w", encoding="utf-8") as f:
        f.write("\n".join(example_lines) + "\n")
    print(f"Generated {ENV_EXAMPLE} with safe placeholders.")

if __name__ == "__main__":
    main()

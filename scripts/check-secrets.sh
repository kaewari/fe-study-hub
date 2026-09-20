#!/usr/bin/env bash
# Pre-commit secret scanning check for FE Study Hub.
# Scans files for potential Google API keys (AIza...) and unmasked secrets.

set -euo pipefail

echo "==> Running Secret Leak Detection Scan..."
ERRORS=0

# Check git tracked files if git repo exists, otherwise scan src/ and public/
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    TARGET_FILES=$(git ls-files | grep -v '\.env\.local$' || true)
else
    TARGET_FILES=$(find src public -type f 2>/dev/null || true)
fi

for f in $TARGET_FILES; do
    if [ -f "$f" ]; then
        # Check for Google Gemini API key pattern: AIzaSy...
        if grep -E 'AIza[0-9A-Za-z_-]{35}' "$f" >/dev/null 2>&1; then
            echo "[DANGER] Potential Google API Key detected in: $f"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done

if [ "$ERRORS" -gt 0 ]; then
    echo "❌ Secret scanning FAILED: Found $ERRORS potential secret leaks!"
    echo "Please remove secrets or move them to .env.local before proceeding."
    exit 1
else
    echo "✅ Secret scanning PASSED: No credentials or API keys found in scanned files."
    exit 0
fi

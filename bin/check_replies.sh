#!/usr/bin/env bash
set -euo pipefail
cd /Users/bretthalverson/Projects/revenue-lab/ventures/missed-call-rescue-kit
mkdir -p logs "$HOME/.hermes/state/missed-call-rescue-kit"
LOG=logs/reply-watch.log
STATE="$HOME/.hermes/state/missed-call-rescue-kit/seen.txt"
touch "$STATE"
TMP=$(mktemp)
# Recent inbox scan for campaign keyword or contacted prospect replies. Himalaya output is intentionally appended for operator review.
if himalaya envelope list -a gmail --page-size 30 > "$TMP" 2>> logs/reply-watch.err.log; then
  if grep -Ei 'CALLS|Missed-Call Rescue|missed call|not a fit' "$TMP" | grep -Fvxf "$STATE" > "$TMP.matches" || true; then
    if [ -s "$TMP.matches" ]; then
      while IFS= read -r line; do
        printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$line" >> "$LOG"
        printf '%s\n' "$line" >> "$STATE"
      done < "$TMP.matches"
    else
      printf '%s no new campaign replies\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$LOG"
    fi
  fi
else
  printf '%s himalaya scan failed\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$LOG"
fi
rm -f "$TMP" "$TMP.matches"

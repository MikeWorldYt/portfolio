#!/usr/bin/env bash
# Creates one GitHub issue per spec/issues/*.md, skipping titles that already exist.
set -euo pipefail

cd "$(dirname "$0")/.."

for file in spec/issues/*.md; do
  title=$(head -n 1 "$file" | sed 's/^# *//')

  if gh issue list --state all --search "\"$title\" in:title" --json title --jq '.[].title' | grep -Fxq "$title"; then
    echo "skip: $title"
    continue
  fi

  gh issue create --title "$title" --body-file "$file"
done

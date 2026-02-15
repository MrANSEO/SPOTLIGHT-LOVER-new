#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   1) Start merge/rebase and stop on conflicts.
#   2) Run this script from repo root.
#   3) Continue merge/rebase.

FILES=(
  "backend/src/modules/candidates/candidates.controller.ts"
  "backend/src/modules/candidates/candidates.service.ts"
  "backend/src/modules/users/users.service.ts"
  "frontend/src/pages/public/CandidateApply.jsx"
  "frontend/src/pages/public/CandidatePaymentCallback.jsx"
)

for file in "${FILES[@]}"; do
  if git ls-files -u -- "$file" | grep -q .; then
    echo "Resolving with current branch version: $file"
    git checkout --ours -- "$file"
    git add "$file"
  else
    echo "No conflict for: $file"
  fi
done

echo "Done. Run one of:"
echo "  git merge --continue"
echo "  git rebase --continue"

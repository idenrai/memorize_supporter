#!/usr/bin/env bash
# block-dangerous-commands.sh
# Blocks dangerous shell commands before they are executed by the Copilot agent.
# Requires: jq
#
# Environment variables (set via hooks config `env` field):
#   BLOCK_MODE  "deny" (default) — block and report | "log" — warn only
#
# Blocked patterns:
#   - git push --force / -f         (history rewrite on remote)
#   - git reset --hard              (destroys uncommitted changes)
#   - rm -rf                        (recursive force delete)
#   - --no-verify                   (bypasses git hooks)
#   - git branch/tag -d/D ...main   (deletes main branch or tag)

set -euo pipefail

# Verify jq is available
if ! command -v jq >/dev/null 2>&1; then
  echo "block-dangerous-commands: jq not found, skipping hook" >&2
  exit 0
fi

payload="$(cat)"
block_mode="${BLOCK_MODE:-deny}"

tool_name="$(printf '%s' "$payload" | jq -r '.toolName // empty')"
[[ "$tool_name" != "bash" ]] && exit 0

# toolArgs is a JSON string — parse it a second time
command="$(printf '%s' "$payload" | jq -r '.toolArgs' | jq -r '.command // empty' 2>/dev/null || true)"
[[ -z "$command" ]] && exit 0

deny_reason=""

# Force push
if printf '%s' "$command" | grep -qE 'git[[:space:]]+push[[:space:]].*(-f\b|--force)'; then
  deny_reason="Force push is not allowed. Use git push without --force."

# Hard reset
elif printf '%s' "$command" | grep -qE 'git[[:space:]]+reset[[:space:]]+--hard'; then
  deny_reason="git reset --hard is not allowed. This destroys uncommitted changes."

# Recursive force delete
elif printf '%s' "$command" | grep -qE 'rm[[:space:]]+-[a-zA-Z]*r[a-zA-Z]*f|rm[[:space:]]+-[a-zA-Z]*f[a-zA-Z]*r'; then
  deny_reason="rm -rf is not allowed. Use targeted file deletions instead."

# Bypass git hooks
elif printf '%s' "$command" | grep -qE -- '--no-verify'; then
  deny_reason="Bypassing git hooks with --no-verify is not allowed."

# Delete main branch or tag
elif printf '%s' "$command" | grep -qE 'git[[:space:]]+(branch|tag)[[:space:]]+-[dD][[:space:]].*main'; then
  deny_reason="Deleting the main branch or main tag is not allowed."
fi

if [[ -n "$deny_reason" ]]; then
  short_cmd="$(printf '%.80s' "$command")"
  if [[ "$block_mode" == "deny" ]]; then
    jq -cn --arg reason "Blocked: ${deny_reason} (command: ${short_cmd}...)" \
      '{permissionDecision:"deny",permissionDecisionReason:$reason}'
  else
    echo "[block-dangerous-commands] Would block: ${short_cmd}..." >&2
  fi
fi

exit 0

    DENY_REASON="Deleting the main branch or main tag is not allowed."
fi

if [ -n "$DENY_REASON" ]; then
    printf '{"permissionDecision":"deny","permissionDecisionReason":"%s"}\n' "$DENY_REASON"
    exit 0
fi

exit 0

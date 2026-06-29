# block-dangerous-commands.ps1
# Windows PowerShell equivalent of block-dangerous-commands.sh
# Blocked patterns: force push, reset --hard, rm -rf, --no-verify, delete main

Set-StrictMode -Version Latest

$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
$blockMode = if ($env:BLOCK_MODE) { $env:BLOCK_MODE } else { "deny" }

$toolName = $payload.toolName
if ($toolName -ne "bash") { exit 0 }

# toolArgs is a JSON string — parse it a second time
$toolArgs = $payload.toolArgs | ConvertFrom-Json
$command = if ($toolArgs.command) { $toolArgs.command } else { "" }
if (-not $command) { exit 0 }

$denyReason = ""

if ($command -match 'git\s+push\s+.*(-f\b|--force)') {
    $denyReason = "Force push is not allowed. Use git push without --force."
} elseif ($command -match 'git\s+reset\s+--hard') {
    $denyReason = "git reset --hard is not allowed. This destroys uncommitted changes."
} elseif ($command -match 'rm\s+-[a-zA-Z]*r[a-zA-Z]*f|rm\s+-[a-zA-Z]*f[a-zA-Z]*r') {
    $denyReason = "rm -rf is not allowed. Use targeted file deletions instead."
} elseif ($command -match '--no-verify') {
    $denyReason = "Bypassing git hooks with --no-verify is not allowed."
} elseif ($command -match 'git\s+(branch|tag)\s+-[dD]\s+.*main') {
    $denyReason = "Deleting the main branch or main tag is not allowed."
}

if ($denyReason) {
    $shortCmd = if ($command.Length -gt 80) { $command.Substring(0, 80) } else { $command }
    if ($blockMode -eq "deny") {
        @{
            permissionDecision       = "deny"
            permissionDecisionReason = "Blocked: $denyReason (command: ${shortCmd}...)"
        } | ConvertTo-Json -Compress
    } else {
        [Console]::Error.WriteLine("[block-dangerous-commands] Would block: ${shortCmd}...")
    }
}

exit 0

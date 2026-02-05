# Push this project to GitHub (Sales-Dashboard repo)
# 1. Create a repo on github.com named "Sales-Dashboard" (or use existing)
# 2. Run this script in PowerShell from this folder:
#    .\push-to-github.ps1

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/tkiraly31-coder/Sales-Dashboard.git"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "ERROR: Git not found. Install from https://git-scm.com/download/win" -ForegroundColor Red
  exit 1
}

$root = $PSScriptRoot
Set-Location $root

if (-not (Test-Path ".git")) {
  git init
  git add .
  git commit -m "Initial commit: Total Volume Dashboard"
  git branch -M main
} else {
  git add -A
  $status = git status --porcelain
  if ($status) {
    git commit -m "Update: Sales Dashboard (segments, filters, Google Sheets, Recharts tooltip types)"
  }
}

# Add Sales-Dashboard as remote (keep existing origin if you use it)
git remote remove sales 2>$null
git remote add sales $repoUrl
git push -u sales main

Write-Host "Done. Sales Dashboard pushed to: $repoUrl" -ForegroundColor Green

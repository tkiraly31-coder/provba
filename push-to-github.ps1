# Push this project to GitHub (Sales-Dashboard repo)
# Run from this folder in PowerShell:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass   (if scripts are disabled)
#   .\push-to-github.ps1
# If it still fails, see PUSH_SALES_DASHBOARD.md for step-by-step commands.

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
  git commit -m "Initial commit: Sales Dashboard"
  git branch -M main
} else {
  git add -A
  $status = git status --porcelain
  if ($status) {
    git commit -m "Update: Sales Dashboard (segments, filters, Google Sheets, Recharts tooltip types)"
  }
}

git remote remove sales 2>$null
git remote add sales $repoUrl

git push -u sales main
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Push failed. Common causes:" -ForegroundColor Yellow
  Write-Host "  1. Repo not created: Create an empty repo named 'Sales-Dashboard' at https://github.com/new" -ForegroundColor Yellow
  Write-Host "  2. Auth: Use a Personal Access Token (not password) when prompted. GitHub -> Settings -> Developer settings -> PAT" -ForegroundColor Yellow
  Write-Host "  3. Remote has README: Run: git pull sales main --allow-unrelated-histories  then  git push -u sales main" -ForegroundColor Yellow
  Write-Host "See PUSH_SALES_DASHBOARD.md for full steps." -ForegroundColor Cyan
  exit 1
}
Write-Host "Done. Sales Dashboard pushed to: $repoUrl" -ForegroundColor Green

# Push this project to Sales-Dashboard repo

If the PowerShell script doesn’t work, use these steps in order.

---

## 1. Open terminal in this folder

- In Cursor/VS Code: **Terminal → New Terminal**
- Or open **PowerShell** or **Git Bash** and `cd` to this folder:
  ```powershell
  cd "c:\Users\TamasKiraly\OneDrive - Token.io Limited\Desktop\PERSONAL\Cursor folder"
  ```

---

## 2. If you get “running scripts is disabled”

Run this once in the same terminal, then run the script again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\push-to-github.ps1
```

Or skip the script and run the git commands below manually.

---

## 3. Create the GitHub repo (if needed)

1. Go to **https://github.com/new**
2. Repository name: **Sales-Dashboard**
3. Choose **Public**
4. Do **not** check “Add a README file” (empty repo is easiest)
5. Click **Create repository**

---

## 4. Run these git commands

Copy and run one block at a time.

**Stage and commit:**
```powershell
git add -A
git status
git commit -m "Sales Dashboard: segments, filters, Google Sheets, data structures, Recharts types"
```

**Add remote and push (use your own GitHub username if not tkiraly31-coder):**
```powershell
git remote remove sales 2>$null
git remote add sales https://github.com/tkiraly31-coder/Sales-Dashboard.git
git push -u sales main
```

---

## 5. If push is rejected (“updates were rejected”)

The repo probably has an initial commit (e.g. README). Either:

**Option A – Merge with remote (keeps README):**
```powershell
git pull sales main --allow-unrelated-histories
# Fix conflicts if any, then:
git push -u sales main
```

**Option B – Overwrite remote (use only if the repo has nothing you need):**
```powershell
git push -u sales main --force
```

---

## 6. If you get “Authentication failed” or “password authentication removed”

GitHub no longer accepts account passwords for git over HTTPS.

1. Go to **GitHub → Settings → Developer settings → Personal access tokens**
2. Generate a new token (classic), enable **repo**
3. When `git push` asks for a password, paste the **token** (not your GitHub password)

Or use **GitHub Desktop** / **Git Credential Manager** and sign in there.

---

## 7. Check the repo

After a successful push, open:

**https://github.com/tkiraly31-coder/Sales-Dashboard**

(Replace `tkiraly31-coder` with your username if different.)

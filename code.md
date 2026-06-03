# 📓 code.md — Portfolio Build Log

> **Purpose:** A running changelog of every meaningful change and command, so context can be
> rebuilt at any time. **Always append here when making changes.** Newest entries at the bottom
> of each section.

---

## 🎯 Project Overview

**Goal:** A "really good", highly interactive personal portfolio for **Harshvardhan Singh Sisodia**,
a Backend Software Engineer (3+ yrs). Theme: **distributed systems** — lean into the domain.

**Owner contact / links**
- Email: harshrana451@gmail.com · (phone intentionally OMITTED from public site + repo)
- GitHub: https://github.com/WildxHV (handle `@WildxHV`)
- LinkedIn: https://www.linkedin.com/in/harshvardhansinghsisodia/
- Location: Bengaluru, India

**Source of truth for content:** the résumé (pasted by user; see "Content" section below).

---

## 🧱 Tech Stack & Decisions

- **Hand-built static site**: HTML + CSS + vanilla JS. **No framework, no build step.**
  - Why: instant load, zero deps, trivial to deploy (GitHub Pages / Netlify / Vercel).
- Fonts: Google Fonts — `Space Grotesk` (display), `Inter` (body), `JetBrains Mono` (code).
- Theme: dark-first, with a light/dark toggle (persisted to `localStorage`).
- Palette: near-black navy bg `#07090f`; accents cyan `#22d3ee` → indigo `#818cf8` → violet `#c084fc`; healthy-green `#34d399`.

### Signature interactive pieces
1. Mouse-reactive **node-network canvas** in hero (distributed-systems motif).
2. **Count-up stat tiles** (IntersectionObserver) for headline metrics.
3. **Live request-trace / latency widget** (Client → API → Redis → DB pulse) in About.
4. Interactive **experience timeline**, scroll-reveal, magnetic buttons, typed role text, tilt cards.

---

## 📁 File Structure

```
portfolio/
├── index.html          # markup (all sections)
├── code.md             # THIS log
├── README.md           # (todo) deploy instructions
├── .gitignore          # (todo)
├── css/
│   └── styles.css      # (todo) all styles
├── js/
│   └── main.js         # (todo) all interactivity
└── assets/             # (kept empty — résumé PDF NOT committed; it contains the phone number)
```

## 📑 Page sections (index.html)
Nav · Hero · Stats · About (+trace widget) · Stack/Skills · Experience (timeline) · Projects · Contact · Footer.

---

## ⚙️ Conventions / Standing Rules
- **Commit messages:** plain, conventional style. **DO NOT add a "Co-Authored-By: Claude" trailer.** (user instruction)
- **No git worktrees** — edit the active repo/branch directly. (user instruction)
- Always update this `code.md` when changing files or running notable commands.

---

## 🗓️ Changelog

### 2026-06-03
- **Setup** — Created project dirs: `portfolio/{css,js,assets}` via `mkdir -p`.
- **Content** — Extracted résumé text (user pasted full résumé). Captured roles, projects, skills, metrics.
- **index.html** — Wrote full markup: nav, hero (node canvas + typed role + socials), stats (4 count-up tiles),
  about (+ live request-trace widget), stack (8 skill cards), experience (3-role timeline:
  Delta Exchange / Sigmoid Analytics / Freelance), projects (Web3 Bug Bounty, FindMy Equipments, GitHub CTA),
  contact (terminal + links), footer. Includes scroll-progress bar, grid/noise overlays, custom cursor glow.
- **code.md** — Created this log.
- **.gitignore** — Added (OS/editor/log ignores).
- **assets/resume.pdf** — Initially copied for a download button, then **deleted** (see decision below). Original safe in `Documents/`.
- **git** — Verified git 2.30 + gh 2.92 (authed as `WildxHV`, `repo` scope, ssh). `git init -b main`; initial commit `eb21fe9` (4 files, 577 insertions). Identity: WildxHV / hvsisodia02@gmail.com.
- **memory** — Saved standing prefs: no "Co-Authored-By: Claude" trailer; portfolio project note (keep code.md updated).
- Commands run: `mkdir -p portfolio/{css,js,assets}`, `cp resume`, `git init -b main`, `git add -A`, `git commit`.
- **DECISION (GitHub + privacy)** — `gh repo create portfolio` failed: name taken by an existing **2023 repo `WildxHV/Portfolio`** ("Porfolio Website", has a literal "Removed phone number" commit). User chose to:
  1. **Replace the old `Portfolio` repo** → will `git push --force origin main` to `git@github.com:WildxHV/Portfolio.git` once the site is finished (serves at wildxhv.github.io/Portfolio if Pages on).
  2. **Omit the phone number** everywhere public.
  → Edited `index.html`: nav "Résumé" btn → "Let's talk" (#contact); contact "tel:" btn → "Connect on LinkedIn"; removed résumé download icon. Deleted `assets/resume.pdf`. Scrubbed phone from `code.md`. **Amended the root commit** so phone/PDF never enter pushed history.
  - **Plan:** finish CSS+JS → verify → `git remote add origin <Portfolio ssh>` → `git push --force` → confirm/enable GitHub Pages.

<!-- Append new entries above this line, under the correct date -->

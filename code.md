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

- **css/styles.css** — Full design system: tokens (dark + `[data-theme=light]`), reset, utilities (`.glass`, `.grad-text`, `.reveal`, `.pulse-dot`, `.btn`, `.tag`), background layers (canvas/grid/noise/cursor-glow/scroll-progress), nav (+mobile slide menu), hero, stats, sections, about + trace widget, stack cards, timeline, project cards (cursor-follow glow), contact, footer, responsive breakpoints (900/720/480), reduced-motion. Tweaked `.cursor-glow` z-index 0 → -1 (sit behind content).
- **js/main.js** — All interactivity (IIFE, vanilla): footer year, theme toggle (localStorage + `themechange` event), nav scrolled state + mobile burger, scroll-progress bar, active-link IO, reveal-on-scroll (staggered), count-up stats (cubic ease), typed role text, contact terminal typing, cursor glow + magnetic buttons + tilt cards + project glow (skipped on touch/reduced-motion), **live request-trace** sim (client→api→redis→db, ~68% cache hit, latency readout + log, runs only while on-screen), **node-network canvas** (DPR-aware, mouse-repulsion + link-to-cursor, theme-reactive colors, pauses when tab hidden).
- Status: site feature-complete.
- **Preview verify** — Static server via `.claude/launch.json` (added `portfolio` config: `python -m http.server 5500`, cwd `portfolio`) on port 5500. Verified: hero (canvas + typed text + magnetic CTAs), stats count-up, about + live trace widget (cache HIT @ 54ms, log streaming), experience timeline, projects, contact (no phone/résumé — correct), mobile layout + slide-in menu, light theme (canvas recolors). **No console errors/warnings.**
- **Fix** — Added `html { scroll-padding-top: 90px }` so anchor jumps don't hide section titles under the fixed nav. Verified.
- **Commits** — `9de82e0` (stylesheet), `c0c5b38` (interactivity + log). History: bf812bc → 9de82e0 → c0c5b38.
- **Deploy** — `git remote add origin git@github.com:WildxHV/Portfolio.git`. Archived old 2023 site to remote branch **`archive-2023`** (sha `01c797f`). `git push --force origin main` (replaced old site). Enabled **GitHub Pages** (main / root) → **https://wildxhv.github.io/Portfolio/** (https enforced). Set repo homepage + description.
  - Remote branches now: `main` (new site), `archive-2023` (old site — user may delete).
  - Asset paths are relative, so they work under the `/Portfolio/` sub-path.
- **✅ LIVE & verified** — https://wildxhv.github.io/Portfolio/ returns HTTP 200; served HTML is the new site (title, `id="net"`, `request_trace.live`, `js/main.js` present); `css/styles.css` + `js/main.js` resolve 200 under `/Portfolio/`. **Done.**

## ▶️ Resume / next-time notes
- Local dev: `preview_start` config `portfolio` (python http.server :5500), or just open `index.html`.
- To redeploy: commit to `main` and `git push origin main` (Pages auto-rebuilds). Remote = `git@github.com:WildxHV/Portfolio.git`.
- Possible future polish: add an SEO `og:image`, a redacted (phone-free) résumé PDF + download button, more projects, custom domain.

- **Content updates (user request)** —
  - **Email** → `hvsisodia02@gmail.com` everywhere (hero social + contact button text/href; replace_all).
  - **Status** → "Open to SDE 2 roles" (about-facts `status`, contact sub copy, nav logo `title`); contact terminal cmd → `role=SDE-2`.
  - **Added CookFit project** as `/01` (newest; renumbered Web3 → /02, FindMy → /03). Linked to its PUBLIC repo `github.com/WildxHV/cookfit`. Card: multi-provider LLM fallback (Groq→Gemini→OpenAI→Grok), self-growing strictly-validated catalog; tags React/TS/FastAPI/SQLAlchemy/Tailwind/LLM; "new this week" badge; added `.proj-card__repo` link style in CSS. (CookFit = FastAPI+React/Vite full-stack AI nutrition app at `C:\Users\Harshvardhan\cookfit`.)
  - **AI tools** → renamed skill card "AI & Tooling" → "AI-Assisted Engineering"; added Claude Code, GitHub Copilot, Cursor, ChatGPT/Claude, Multi-Provider LLM. Expanded About paragraph to name Claude Code/Copilot/Cursor + tie to CookFit.
  - Verified live preview (DOM assertions + screenshots of CookFit card & AI card); **no console errors.**

<!-- Append new entries above this line, under the correct date -->

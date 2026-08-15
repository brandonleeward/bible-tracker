# SPEC.md — Bible Tracker PWA

## 1. Product Overview
A mobile-first Progressive Web App (PWA) designed for tracking Bible reading progress across multiple biblical canons (Protestant, Catholic, Orthodox). 

* **Target Experience:** Offline-first, fast load times, zero login/backend friction, native app feel on iOS and Android.
* **Core Value:** Flexible multi-canon support with granular chapter checklists, daily habit tracking, and pace forecasting.

---

## 2. Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React (Vite) | Single-Page Application (SPA) UI |
| **PWA & Offline** | `vite-plugin-pwa` + Workbox | Service Worker caching and Web App Manifest |
| **Local Database** | Dexie.js (IndexedDB) | Reactive, schema-based on-device storage |
| **Routing** | `react-router-dom` | Mobile view navigation (Dashboard, Books, Goals, Settings) |
| **Styling** | Vanilla CSS / CSS Variables | Mobile design tokens with iOS safe-area handling |

---

## 3. Data Schemas

### A. Dexie.js Database (`src/db.js`)
```javascript
import Dexie from 'dexie';

export const db = new Dexie('BibleTrackerDB');

db.version(1).stores({
  // Keyed by setting key (e.g., 'active_canon', 'goal_chapters_per_day')
  settings: 'key, value',
  
  // Primary key: compound string `[canon+bookId+chapter]`
  // Allows switching canons without corrupting reading state
  progress: '[canon+bookId+chapter], canon, bookId, chapter, completedAt',
  
  // Primary key: date string 'YYYY-MM-DD'
  // Tracks daily read count for streaks and pace calculations
  dailyLog: 'date, chaptersRead'
});

B. Static Canon JSON (src/data/*.json)
Standard format for protestant.json, catholic.json, and orthodox.json:

[
  {
    "id": "gen",
    "name": "Genesis",
    "testament": "OT",
    "section": "Pentateuch",
    "chapterCount": 50
  }
]

4. UI Shell & Navigation Hierarchy
App Shell: Bottom navigation bar (fixed position, safe-area padding for mobile home indicators).
Routes:

/ — Dashboard: Completion %, daily streak, chapters read today, estimated completion date.

/books — Books View: Filterable list of books grouped by Testament/Category; accordion or sub-route for chapter checklist.

/goals — Goals View: Target pace configuration (e.g., 3 chapters/day or 1 year plan) and reading velocity charts.
/settings — Settings View: Canon selector (Protestant 66, Catholic 73, Orthodox 76-81), backup/export JSON, clear data.

5. Phased Implementation Plan

Phase 1: Project Scaffold & PWA Shell
[ ] Initialize Vite + React project.
[ ] Install vite-plugin-pwa, dexie, and react-router-dom.
[ ] Configure vite.config.js with PWA manifest (icons, standalone display mode, background colors).
[ ] Add mobile viewport meta tags and safe-area CSS rules in index.html and App.css.
[ ] Set up basic Dexie schema in src/db.js.
[ ] Create basic routing shell with persistent BottomNav.

Phase 2: Canon Dataset Pipeline
[ ] Write Python normalization script (scripts/normalize_canons.py) to parse open scripture metadata.
[ ] Generate standard JSON datasets in src/data/:
protestant.json (66 books)
catholic.json (73 books — adds Deuterocanonical books)
orthodox.json (adds 3 Maccabees, 1 Esdras, Prayer of Manasseh, Psalm 151, etc.)

Phase 3: Settings & State Binding
[ ] Build Settings page with active canon selector.
[ ] Bind selected canon to Dexie settings table.
[ ] Load canon-specific book list reactively across the app using useLiveQuery from Dexie.

Phase 4: Chapter Checklist & Progress Logic
[ ] Build Books list page with percentage bars per book.
[ ] Implement responsive chapter grid modal/view.
[ ] Add tap-to-toggle completion logic updating Dexie progress table.
[ ] Update dailyLog entry for today's date upon every chapter completion toggle.

Phase 5: Goal Setting & Streak Engine
[ ] Build Goals settings interface (target chapters per day / target completion date).
[ ] Implement streak calculation algorithm (consecutive days with chaptersRead > 0).

Phase 6: Dashboard Metrics & Pace Forecasting

[ ] Compute total % of Bible completed based on total chapter count of active canon.
[ ] Calculate rolling 7-day reading velocity (\text{chapters} / \text{day}).
[ ] Calculate dynamic projected finish date:

Days Remaining = (Total Chapters - Completed Chapters) / Current Pace


Phase 7: Mobile Polish & PWA Installation
[ ] Verify PWA install prompt triggers on Chrome/Android and Safari iOS ("Add to Home Screen").
[ ] Generate app icons (192x192, 512x512, apple-touch-icon).
[ ] Test complete offline functionality via browser DevTools network throttling (offline mode).
[ ] Validate bottom navigation clearance against iPhone home bar (env(safe-area-inset-bottom)).

6. Acceptance Criteria (v1 Target)
Zero Network Dependence: App fully loads and tracks reading when completely disconnected from the internet.
State Isolation: Switching between Protestant and Orthodox canons retains previously completed progress for all shared books.
Reactive UI: Marking a chapter complete immediately updates the Dashboard progress percentage and streak count without page reload.


---

## Three Technical Recommendations for This Spec

1. **Use Compound Primary Keys in Dexie:** Notice the progress key schema above: `[canon+bookId+chapter]`. If you complete Genesis 1 in the Protestant canon and switch to Orthodox, your progress remains intact without database collisions or schema migration headaches.

2. **Handling Decrement on Unticking:** When a user unchecks a chapter, ensure your Dexie transaction decrements today's `dailyLog.chaptersRead` count so streaks and pace metrics remain accurate.

3. **Safe Area Insets for iOS PWA:** Make sure your `App.css` includes `padding-bottom: env(safe-area-inset-bottom);` on the bottom navigation bar so navigation items don't overlap the iPhone home indicator bar.
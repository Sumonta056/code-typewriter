Feature Improvements

1. More languages — Only Vue JS & Nuxt JS exist in snippets.json. Add
   ,Java , Spring Boot, Python, TypeScript, Go, Rust, React — this is the single biggest value
   add.
2. Mistake heatmap — Track which characters/positions you error on
   most. Show in profile. useHistoryStore already saves errors but doesn't
3. Personal best indicator — Flash "New PB!" on the results card when
   you beat your best WPM for that language.
4. GitHub repo browser — type owner/repo
   and browse files. Builds on existing useGithubFetcher.
5. Pause/resume — Currently there's no way to pause mid-session.
6. Export stats — Download history as CSV from the profile page.
7. Snippet bookmarks — Star files you want to practice again.
8. Word-level error highlighting — Currently errors are per-character;
   grouping them visually at the word level feels less punishing and is
   cleaner.
9. Smoother scroll — The auto-scroll jump is abrupt; a
   scroll-behavior: smooth with a small offset would help.

10. WPM trend chart — The bar chart on the profile page uses raw <div>
    bars. Replace with a proper line chart (e.g. lightweight chart.js or a
    pure-CSS sparkline) — it'll look much more polished.
11. Calendar heatmap — A GitHub-style contribution grid showing
    practice frequency by day. useHistoryStore has all the data needed.
12. Live accuracy graph — Small inline graph in the sidebar showing
    accuracy over time during the session.

13. Result card animation — Animate each stat number counting up from 0
    on the results screen. Currently they just appear.
14. Error shake animation — When you type wrong, a brief horizontal
    shake on the current character instead of just turning red.
15. Theme switcher — The CSS variable system (variables.css) is already
    well-structured for this. A "Monokai" or "Solarized" variant would be
    straightforward.

Also, the code is not rendering properly. I think it's missing some of the variables, words; sometimes it breaks; there are empty spaces. I think it's not completely able to show the exact code from the URL. Sometimes in the editor, it's breaking the code also.

Now I have the full picture. Three separate issues at play:

Issue 1 (CSS) — overflow-wrap: break-word breaks identifiers mid-character. A long identifier like getUserById can split as getUser / ById across two visual lines. The second fragment looks like a "missing" word or "empty space" on the new line.

Issue 2 (CSS) — overflow-x: hidden + overflow-y: auto on the same element. CSS spec behavior: when one axis is auto, browsers can silently change the other hidden to auto, producing an unexpected horizontal scrollbar. Using overflow-x: clip instead truly clips without creating a scroll container.

Issue 3 (Fetcher) — .trimEnd() on every line strips trailing spaces, so the displayed code doesn't match the source exactly.

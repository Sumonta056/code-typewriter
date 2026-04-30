## GitHub Fetcher Rules

- **API-first, raw fallback.** `useGithubFetcher` tries the GitHub Contents API (`Accept: application/vnd.github.v3.raw`) first, then falls back to `raw.githubusercontent.com`. This avoids CORS issues on private repos while remaining resilient.
- **URL normalisation.** `parseGitHubUrl` accepts all three common GitHub URL formats: browser URL (`github.com/…/blob/…`), raw URL (`raw.githubusercontent.com/…`), and plain `owner/repo/branch/path` paths.
- **Line limit is enforced.** Code is sliced to `maxLines` (from settings, default 50) before being passed to the tokenizer.
- **Line endings are normalised.** `\r\n` and `\r` are both converted to `\n` before processing.
- **Trailing whitespace is stripped per line** using `trimEnd()` so the user never has to type invisible trailing spaces.

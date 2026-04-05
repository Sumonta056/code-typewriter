export function useGithubFetcher() {
  const isLoading = ref(false)

  function parseGitHubUrl(input: string) {
    input = input.trim()
    input = input.replace(/^https?:\/\//, '')
    input = input.replace(/^(www\.)?github\.com\//, '')
    input = input.replace(/^raw\.githubusercontent\.com\//, '')

    const parts = input.split('/')
    if (parts.length < 4) return null

    const owner = parts[0]
    const repo = parts[1]

    let branchStart = 2
    if (parts[2] === 'blob' || parts[2] === 'tree') {
      branchStart = 3
    }

    if (parts.length <= branchStart) return null

    const branch = parts[branchStart]
    const path = parts.slice(branchStart + 1).join('/')

    if (!path) return null

    return { owner, repo, branch, path }
  }

  function buildRawUrl(parsed: ReturnType<typeof parseGitHubUrl>) {
    if (!parsed) return ''
    return `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${parsed.branch}/${parsed.path}`
  }

  function buildApiUrl(parsed: ReturnType<typeof parseGitHubUrl>) {
    if (!parsed) return ''
    return `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/contents/${parsed.path}?ref=${parsed.branch}`
  }

  async function fetchCode(url: string, maxLines: number): Promise<{ code: string; fileName: string } | null> {
    isLoading.value = true

    try {
      let code: string | null = null
      const parsed = parseGitHubUrl(url)

      if (parsed) {
        try {
          const apiUrl = buildApiUrl(parsed)
          const res = await fetch(apiUrl, {
            headers: { Accept: 'application/vnd.github.v3.raw' },
          })
          if (res.ok) code = await res.text()
        } catch { /* fall through */ }

        if (!code) {
          const rawUrl = buildRawUrl(parsed)
          const res = await fetch(rawUrl)
          if (res.ok) code = await res.text()
        }
      } else {
        const res = await fetch(url)
        if (res.ok) code = await res.text()
      }

      if (!code) throw new Error('Could not fetch file')

      code = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

      const lines = code.split('\n')
      if (lines.length > maxLines) {
        code = lines.slice(0, maxLines).join('\n')
      }

      code = code
        .split('\n')
        .map(l => l.trimEnd())
        .join('\n')
        .trimEnd()

      if (!code) throw new Error('File is empty')

      const fileName = parsed ? parsed.path.split('/').pop()! : 'file'
      return { code, fileName }
    } catch (e) {
      console.error('Fetch error:', e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, parseGitHubUrl, fetchCode }
}

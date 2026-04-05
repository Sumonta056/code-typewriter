export interface SnippetFile {
  name: string
  url: string
}

export interface Language {
  id: string
  name: string
  extension: string
  files: SnippetFile[]
}

export interface SnippetsData {
  languages: Language[]
}

export interface Result<T = unknown> {
  status: boolean
  msg: string
  data?: T
}

export interface ArticleContent {
  id: number
  title: string
  content: string
}

export interface ArticleSummary {
  id: number
  title: string
  tags: Array<string>
  createdAt: Date
  coverUrl?: string
}

export interface Tag {
  id: number
  name: string
}

export interface Comment {
  article_id: number
  content: string
}

export interface ArticleRequest {
  title: string
  content: string
  tag_ids: number[]
}

export interface OJProblem {
  id: number
  title: string
  content: string
}

export interface OJTestCase {
  input: string
  output: string
}

export interface OJRequest {
  title: string
  content: string
}

export interface JudgeRequest {
  language_id: number
  source_code: string
  tid: number
}

export interface SubmitResponse {
  tokens: string[]
}

export interface JudgeResult {
  status: boolean
  msg: string
}

export interface MultiJudgeResult {
  results: JudgeResult[]
}

export type JudgeStatusMsg = JudgeResult['msg']

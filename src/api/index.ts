import axios from 'axios'
import type {
  ArticleContent,
  ArticleSummary,
  Tag,
  Comment,
  Result,
  ArticleRequest,
  OJProblem,
  OJTestCase,
  OJRequest,
} from '@/types/api'
import { http } from './http.ts'
import type { AxiosResponse, AxiosError } from 'axios'

async function request<T>(promise: Promise<AxiosResponse<Result<T>>>): Promise<Result<T>> {
  try {
    const response = await promise
    return response.data as Result<T>
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<Result<T>>
      return (
        err.response?.data || {
          status: false,
          msg: '前端的bug',
        }
      )
    }
    return {
      status: false,
      msg: error instanceof Error ? error.message : '未知错误',
    }
  }
}

export const api = {
  //
  createTag: (name: string) => request<null>(http.post(`/tags`, { name })),
  getTags: () => request<Tag[]>(http.get('/tags')),
  updateTag: (id: number, tag: { name: string }) => request<null>(http.put(`/tags/${id}`, tag)),
  deleteTag: (id: number) => request<null>(http.delete(`/tags/${id}`)),
  //
  createArticle: (article: ArticleRequest) => request<null>(http.post(`/articles`, article)),
  deleteArticle: (id: number) => request<null>(http.delete(`/articles/${id}`)),
  getArticles: () => request<ArticleSummary[]>(http.get('/articles')),
  getArticleById: (id: number) => request<ArticleContent>(http.get(`/articles/${id}`)),
  //
  getCommentsByArticleId: (id: number) => request<string[]>(http.get(`/comments/${id}`)),
  postComment: (comment: Comment) => request<string>(http.post(`/comments`, comment)),
  //
  postOJProblem: (problem: OJRequest) => request<number>(http.post(`/oj/problem`, problem)),
  getOJProblems: () => request<OJProblem[]>(http.get('/oj/problems')),
  deleteOJProblem: (id: number) => request<null>(http.delete(`/oj/problem/${id}`)),
  postOJTestCase: (problemTests: OJTestCase[], problem_id: number) =>
    request<null>(http.post(`/oj/testcase/${problem_id}`, problemTests)),
}

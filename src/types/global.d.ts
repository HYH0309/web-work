// src/types/global.d.ts

// 扩展全局类型声明
declare global {
  // 文章标签类型
  export interface Result<T = unknown> {
    status: boolean
    msg: string
    data?: T
  }
  export interface Article {
    id: number
    title: string
    tags: string[]
    createdAt: Data
  }
  export interface ArticleContent {
    title: string
    content: string
  }
}

// 确保模块化环境下的类型安全
export {}

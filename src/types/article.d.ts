// src/types/global.d.ts

// 扩展全局类型声明

// 文章标签类型

interface ArticleSummary {
  id: number
  title: string
  tags: string[]
  createdAt: Date
  coverUrl?: string
}
interface ArticleContent {
  title: string
  content: string
}

// 确保模块化环境下的类型安全
export { ArticleSummary, ArticleContent }

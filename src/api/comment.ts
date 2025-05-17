// 模拟评论服务，未来可替换为真实API调用
const comments: string[] = [
  '666666',
  '前方高能！',
  '主播技术不错',
  '这个操作太秀了',
  '再来一次！',
  '关注了关注了',
]

export const CommentService = {
  async getComments(): Promise<string[]> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300))
    return [...comments]
  },

  async addComment(comment: string): Promise<void> {
    if (!comment.trim()) return
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300))
    comments.push(comment.trim())
  },
}

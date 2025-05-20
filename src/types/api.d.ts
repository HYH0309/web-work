/**
 * Generic API response wrapper
 * @template T - Type of the payload data (default: unknown)
 */
interface Result<T = unknown> {
  /** Operation success status (true/false) */
  status: boolean
  /** Human-readable result message */
  msg: string
  /** Optional response payload */
  data?: T
}

/**
 * Online Judge problem definition
 * @validate {z.object({
 *   title: z.string().min(1, "Problem title required"),
 *   content: z.string().min(1, "Problem description required")
 * })}
 */
interface OJProblem {
  /** Unique problem ID */
  id: number
  /** Problem title (non-empty) */
  title: string
  /** Problem description/content (non-empty) */
  content: string
}
interface OJRequest {
  title: string
  content: string
}
/**
 * Test case for OJ problems
 * @validate {z.object({
 *   problem_id: z.number().positive(),
 *   input: z.string().min(1, "Test input required"),
 *   output: z.string().min(1, "Expected output required")
 * })}
 */
interface OJTestCase {
  /** Input test data */
  input: string
  /** Expected output data */
  output: string
}

/**
 * Content categorization tag
 * @validate {z.object({
 *   name: z.string().min(1, "Tag name required")
 * })}
 */
interface Tag {
  /** Unique tag ID */
  id: number
  /** Display name (non-empty) */
  name: string
}

/**
 * User-generated comment
 * @validate {z.object({
 *   content: z.string().min(1, "Comment content required")
 * })}
 */
interface Comment {
  /** Related article ID */
  article_id: number
  /** Comment text content (non-empty) */
  content: string
}

/**
 * Article listing item
 * @validate {z.object({
 *   id: z.number().positive("Invalid article ID"),
 *   title: z.string().min(1, "Article title required"),
 *   tags: z.array(z.string().min(1)).nullable().catch([]),
 *   createdAt: z.coerce.date()
 * })}
 * @remarks Empty tags array will be auto-converted from null
 */
interface ArticleSummary {
  /** Unique article ID */
  id: number
  /** Article title (non-empty) */
  title: string
  /** Associated tags (non-empty strings) */
  tags: string[]
  /** Creation timestamp */
  createdAt: Date
  /** Optional cover image URL */
  coverUrl?: string
}

/**
 * Complete article content
 * @validate {z.object({
 *   title: z.string().min(1, "Title required"),
 *   content: z.string().min(100, "Minimum 100 characters required")
 * })}
 */
interface ArticleContent {
  /** Article title (non-empty) */
  title: string
  /** Main content (min 100 chars) */
  content: string
}

/**
 * Article creation/update payload
 * @validate {z.object({
 *   title: z.string().min(1),
 *   content: z.string().min(1),
 *   tag_ids: z.array(z.number().positive())
 * })}
 */
interface ArticleRequest {
  /** Article title */
  title: string
  /** Article content */
  content: string
  /** Array of tag IDs */
  tag_ids: number[]
}

export {
  ArticleContent,
  ArticleSummary,
  Comment,
  OJProblem,
  Result,
  Tag,
  ArticleRequest,
  OJTestCase,
  OJRequest,
}

interface Result<T = unknown> {
  status: boolean
  msg: string
  data?: T
}
export { Result }

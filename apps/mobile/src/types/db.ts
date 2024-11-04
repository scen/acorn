export type HistoryRow = {
  post_id: string
  seen_at: string
}

export type CollapsedRow = {
  collapsed_at: string
  comment_id: string
  post_id: string
}

export type HiddenRow = {
  filtered_at: string
  id: string
  type: 'community' | 'user' | 'post' | 'comment'
}

export type HiddenMap = {
  communities: Array<string>
  users: Array<string>
}

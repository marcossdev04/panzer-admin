export interface Logs {
  id: string
  active: boolean
  created_at: string
  action: string
  description: string
  user: {
    id: string
    name: string
    email: string
  }
}

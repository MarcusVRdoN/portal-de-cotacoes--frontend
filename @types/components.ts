import type { User } from './index'

export interface LoginFormProps {
  onLogin: (user: User) => void
}
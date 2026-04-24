import client from './client'
import type { User } from '@/types/user'

export const usersApi = {
  search: (params: { q?: string; tech?: string; team_id?: number }) =>
    client.get<{ total: number; users: User[] }>('/users/search', { params }).then((r) => r.data.users),

  getMe: () =>
    client.get<User>('/users/me').then((r) => r.data),
}

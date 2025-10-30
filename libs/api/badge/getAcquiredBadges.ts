import { api } from '../axios'
import { BADGE_ENDPOINTS } from '../endpoints'

export async function getAcquiredBadges() {
  const { data } = await api.get(BADGE_ENDPOINTS.GET_BADGES)

  return data
}

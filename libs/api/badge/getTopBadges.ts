import { api } from '../axios'
import { BADGE_ENDPOINTS } from '../endpoints'

export async function getTopBadges() {
  const { data } = await api.get(BADGE_ENDPOINTS.TOP3_CANDIDATES)

  return data
}

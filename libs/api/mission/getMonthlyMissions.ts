import { MonthlyMission } from '@/types/mission'

import { api } from '../axios'
import { MISSION_ENDPOINTS } from '../endpoints'

export async function getMonthlyMissions() {
  const { data } = await api.get<MonthlyMission[]>(MISSION_ENDPOINTS.LIST_BY_RANGE)

  return data
}

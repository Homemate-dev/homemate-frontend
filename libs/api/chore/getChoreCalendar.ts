import { ChoreCalendarDates } from '@/types/chore'

import { api } from '../axios'
import { CHORE_ENDPOINTS } from '../endpoints'

export async function getChoreCalendar(startDate: string, endDate: string) {
  const { data } = await api.get<ChoreCalendarDates>(CHORE_ENDPOINTS.CALENDAR, {
    params: { startDate, endDate },
  })

  return data
}

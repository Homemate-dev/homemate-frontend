import { api } from "../axios";
import { CHORE_ENDPOINTS } from "../endpoints";

export async function getChoreByDate (date: string) {
    const { data } = await api.get(CHORE_ENDPOINTS.LIST_BY_DATE, {
        params: {date}
    })

    return data
}
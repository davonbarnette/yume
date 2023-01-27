import logger from '#logger'
import {JikanAPIAxios} from './axios'

export class JikanAPI {
    static async getSchedules(day){
        try {
            let res = await JikanAPIAxios.get(`/schedules/${day}`)
            return res.data.data
        } catch (e) {
            logger.error("Failed to get schedules from Jikan API", e.message)
            return undefined
        }
    }
}

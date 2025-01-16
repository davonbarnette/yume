import {ValorantAPIAxios} from "./axios.js";
import logger from "#logger";

export class ValorantApi {

    static async getAgents(){
        try {
            let res = await ValorantAPIAxios.get('/agents')
            return res.data.data
        } catch (e) {
            logger.error('Could not get agents from Valorant API', e.message)
            return {error: e.message}
        }
    }

}

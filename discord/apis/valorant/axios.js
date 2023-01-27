import axios from 'axios'
import {VALORANT_API_ENDPOINT} from "#settings"

export const ValorantAPIAxios = axios.create({
    baseURL: VALORANT_API_ENDPOINT
})

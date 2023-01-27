import axios from 'axios'
import {JIKAN_API_ENDPOINT} from "#settings"

export const JikanAPIAxios = axios.create({
    baseURL: JIKAN_API_ENDPOINT
})

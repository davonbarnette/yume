import {Configuration, OpenAIApi} from "openai";
import {OPENAI_API_KEY} from "#settings";
import logger from "#logger";

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export class ChatGPTApi {
    static async createCompletion(text) {
        try {
            let res = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: text,
                temperature: 0.9,
                max_tokens: 4000,
                frequency_penalty: 0.5,
                presence_penalty: 0,
            });
            return res.data;
        } catch (e) {
            logger.error('OpenAI: Could not create completion', e.message)
            return {error: e.message};
        }
    }

    static async createImage(text) {
        try {
            const res = await openai.createImage({
                prompt: text,
                n: 1,
                size: "1024x1024",
            });
            return res.data;
        } catch (e) {
            logger.error('OpenAI: Could not create completion', e.message)
            return {error: e.message};
        }
    }
}

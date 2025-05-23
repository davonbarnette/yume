import {strapiSDK} from '@strapi/sdk-js'
import Logger from "#logger"

const sdk = strapiSDK({
    baseURL: `${process.env.GENSTRAPI_API_ENDPOINT}/api`,
    auth: {
        strategy: 'api-token',
        options: {token: process.env.GENSTRAPI_API_TOKEN}
    }
})

class GenstrapiCollection {
    collection
    collectionName

    constructor(collectionName) {
        this.collection = sdk.collection(collectionName)
        this.collectionName = collectionName
    }

    async findByCanonicalId(id, query = {}) {
        let res = await strapiErrorWrapper(
            async () => await this.collection.find({
                filters: {
                    id
                },
                ...query
            }),
            this.collectionName,
            'findByCanonicalId'
        )
        if (res.data) {
            return res.data[0]
        } else {
            return undefined
        }
    }

    async findFirst(query) {
        let res = await strapiErrorWrapper(
            async () => await this.collection.find(query),
            this.collectionName,
            'findFirst'
        )
        if (res.data) {
            return res.data[0]
        } else {
            return undefined
        }
    }

    async findMany(query) {
        let res = await strapiErrorWrapper(
            async () => await this.collection.find(query),
            this.collectionName,
            'findMany'
        )
        return res?.data
    }

    async create(data, query) {
        let res = await strapiErrorWrapper(
            async () => await this.collection.create(data, query),
            this.collectionName,
            'create'
        )
        return res?.data
    }

    async update(documentId, data, query) {
        let res = await strapiErrorWrapper(
            async () => await this.collection.update(documentId, data, query),
            this.collectionName,
            'update'
        )
        return res?.data
    }

    async delete(documentId, query) {
        let res = await strapiErrorWrapper(
            async () => await this.collection.delete(documentId, query),
            this.collectionName,
            'delete'
        )
        return res?.data
    }

    async findFirstOrCreate(query, data) {
        let firstEntry = await this.findFirst(query)
        if (!firstEntry) {
            firstEntry = await this.create(data)
        }
        return firstEntry
    }

}


export const genstrapi = {
    servers: new GenstrapiCollection('discord-servers'),
    channels: new GenstrapiCollection('discord-channels'),
    reminders: new GenstrapiCollection('reminders'),
    users: new GenstrapiCollection('discord-users'),
    equipments: new GenstrapiCollection('capy-equipments'),
    legacies: new GenstrapiCollection('capy-legacies'),
    inheritances: new GenstrapiCollection('capy-inheritances'),
    pets: new GenstrapiCollection('capy-pets'),
    mounts: new GenstrapiCollection('capy-mounts'),
    artifacts: new GenstrapiCollection('capy-artifacts'),
    skills: new GenstrapiCollection('capy-skills'),
    resources: new GenstrapiCollection('capy-resources'),
    equipmentRotations: new GenstrapiCollection('capy-up-rotations'),
    events: new GenstrapiCollection('capy-events'),
}

async function strapiErrorWrapper(func, collectionName, funcName) {
    try {
        return await func()
    } catch (e) {
        Logger.error(`Error when executing ${funcName} function: ${collectionName}`, e.message)
        return undefined
    }
}



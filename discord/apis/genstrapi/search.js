import {genstrapi} from "#root/apis/index.js";
import Case from "case";

export class GenstrapiSearch {
    collectionsToRegister
    hasRegisteredCollections = false
    maxRecords
    recordsByDocumentId = new Map()
    recordsByInternalId = new Map()
    recordsByCollectionName = new Map()

    constructor(collectionsToRegister, maxRecords = 200) {
        this.collectionsToRegister = collectionsToRegister
        this.maxRecords = maxRecords
        this.init()
    }

    async init() {
        for (let i = 0; i < this.collectionsToRegister.length; i++) {
            const collectionName = this.collectionsToRegister[i];
            const collection = genstrapi[collectionName]
            if (!!collection) {
                let populate = "*"
                if (collectionName === "inheritances"){
                    populate = ['heroes.bonuses']
                }
                const records = await collection.findMany({
                    populate,
                    sort: "name:asc",
                    pagination: {
                        page: 1,
                        pageSize: this.maxRecords
                    }
                })
                if (records) {
                    records.forEach(record => {
                        record.collectionName = collectionName
                        this.addRecordToCollection(record)
                        const {name, documentId} = record
                        this.recordsByDocumentId.set(documentId, record)
                        this.recordsByInternalId.set(this.getInternalId(name, collectionName), record)
                    })
                }
            }
        }
        this.hasRegisteredCollections = true
    }

    addRecordToCollection(record){
        if (!this.recordsByCollectionName.has(record.collectionName)){
            this.recordsByCollectionName.set(record.collectionName, [])
        }
        let curRecords = this.recordsByCollectionName.get(record.collectionName)
        curRecords.push(record)
        this.recordsByCollectionName.set(record.collectionName, curRecords)
    }

    getRecordsByCollection(collectionName){
        return this.recordsByCollectionName.get(collectionName)
    }

    getInternalId(name, type) {
        return `${name} — ${Case.title(type)}`
    }

    parseInternalId(internalId) {
        if (!internalId) {
            return null
        }
        const [name, type] = internalId.split(" — ")
        return {name, type}
    }

    getRecordByDocumentId(documentId) {
        return this.recordsByDocumentId.get(documentId)
    }
    getRecordByInternalId(internalId){
        return this.recordsByInternalId.get(internalId)
    }
    getRecordByNameAndType(name, type) {
        let internalId = this.getInternalId(name, type)
        return this.recordsByInternalId.get(internalId)
    }
    searchByName(search) {
        const filtered = [...this.recordsByInternalId.keys()]
            .filter(internalId => {
                let parsed = this.parseInternalId(internalId)
                if (parsed && parsed.name && parsed.type) {
                    const {name} = parsed
                    if (!search || search.length === 0){
                        return true
                    }
                    else if (search.length === 1){
                        return name.toLowerCase().startsWith(search.toLowerCase())
                    } else {
                        return name.toLowerCase().includes(search.toLowerCase())
                    }
                } else {
                    return false
                }
            })
        return filtered
            .slice(0, Math.min(filtered.length, 25)) // This is for max entries in Discord's autocomplete
            .map(internalId => {
                const record = this.getRecordByInternalId(internalId)
                return {name: internalId, value: record.documentId}
            })
    }
}

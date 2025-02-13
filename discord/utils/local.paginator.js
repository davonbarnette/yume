export class LocalPaginator {
    page = 1
    pageSize
    total
    items
    errored = false
    allData

    constructor(data, pageSize = 10) {
        this.pageSize = pageSize
        this.allData = data
        this.items = data.slice(0, pageSize)
        this.total = data.length
    }

    get pageCount(){
        if (this.allData.length <= this.pageSize){
            return 1
        } else {
            const r = this.allData.length % this.pageSize
            const divisible = (this.allData.length - r) / this.pageSize
            return r === 0 ? divisible : divisible + 1
        }
    }

    async _query() {
        const start = (this.page - 1) * this.pageSize
        const end = start + this.pageSize
        this.items = this.allData.slice(start, end)
        return this.items
    }

    async paginate(direction) {
        let targetPage = this.page + direction
        if (targetPage > 0 && targetPage <= this.pageCount) {
            this.page = targetPage
        }

        await this._query()
        return this
    }

    async toFirstPage() {
        return await this.goToPage(1)
    }

    async toLastPage() {
        return await this.goToPage(this.pageCount)
    }

    async paginateLeft() {
        return await this.paginate(-1)
    }

    async paginateRight() {
        return await this.paginate(1)
    }

    async goToPage(targetPage) {
        if (targetPage > 0 && targetPage <= this.pageCount) {
            this.page = targetPage
        }
        await this._query()
        return this
    }

    get curItems() {
        if (!this.errored) {
            return this.items
        } else {
            return undefined
        }
    }

    get startingItemNumber() {
        return ((this.page - 1) * this.pageSize) + 1
    }

    get endingItemNumber() {
        let curEnd = (this.page) * this.pageSize
        if (curEnd > this.total) {
            curEnd = this.total
        }
        return curEnd
    }

    async initialize() {
        return await this._query()
    }

    get isOnePage() {
        return this.total <= this.pageSize
    }

    get hasNextPage() {
        return this.page < this.pageCount
    }
}

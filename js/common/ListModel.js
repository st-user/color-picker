import CommonEventDispatcher from '../common/CommonEventDispatcher.js';

export default class ListModel {

    #eventNameOnAdd;
    #eventNameOnRemove;
    #itemMap;
    #idCounter;
    #maxSize;

    constructor(eventNameOnAdd, eventNameOnRemove, maxSize) {
        this.#eventNameOnAdd = eventNameOnAdd;
        this.#eventNameOnRemove = eventNameOnRemove;
        this.#itemMap = {};
        this.#idCounter = 0;
        this.#maxSize = maxSize;
    }

    isEmpty() {
        return this.size() === 0;
    }

    size() {
        return this.getItems().length;
    }

    getItems() {
        return Object.values(this.#itemMap);
    }

    getOrderedItems() {
        return this.#idsAsc().map(id => this.getItemById(id));
    }

    getItemById(id) {
        return this.#itemMap[id];
    }

    getItemByIdString(idString) {
        return this.getItemById(parseInt(idString));
    }

    getLatestItem() {
        const idsDesc = this.#idsDesc();
        return this.getItemById(idsDesc[0]);
    }

    addOne(item) {
        const id = this.#generateId();
        this.#itemMap[id] = item;
        this.#dispatchEventOnAdd([{
            id: id,
            item: item
        }]);
        this.removeOldItems();
    }

    addList(items) {
        const itemInfos = items.map(item => {
            const id = this.#generateId();
            this.#itemMap[id] = item;
            return {
                id: id,
                item: item
            };
        });
        this.#dispatchEventOnAdd(itemInfos);
        this.removeOldItems();
    }

    removeById(id) {
        delete this.#itemMap[id];
        this.#dispatchEventOnRemove([ id ]);
    }

    removeOldItems() {
        if (!this.#maxSize || this.#maxSize <= 0) {
            return;
        }
        const idsDesc = this.#idsDesc();
        const deletedIds = idsDesc.splice(this.#maxSize, idsDesc.length);
        if (deletedIds && 0 < deletedIds.length) {
            deletedIds.forEach(id => {
                delete this.#itemMap[id];
            });
            this.#dispatchEventOnRemove(deletedIds);
        }
    }

    removeAll() {
        const ids = Object.keys(this.#itemMap).map(id => parseInt(id));
        ids.forEach(id => {
            delete this.#itemMap[id];
        });
        this.#dispatchEventOnRemove(ids);
    }

    #dispatchEventOnAdd(itemInfos) {
        CommonEventDispatcher.dispatch(this.#eventNameOnAdd, {
            addedItemInfos: itemInfos
        });
    }

    #idsDesc() {
        return this.#idsSorted((a, b) => b - a);
    }

    #idsAsc() {
        return this.#idsSorted((a, b) => a - b);
    }

    #idsSorted(comparator) {
        return Object.keys(this.#itemMap)
            .map(idStr => parseInt(idStr))
            .sort(comparator);
    }

    #dispatchEventOnRemove(ids) {
        if (!ids) {
            return;
        }
        CommonEventDispatcher.dispatch(this.#eventNameOnRemove, {
            ids: ids
        });
    }

    #generateId() {
        const ret = this.#idCounter;
        this.#idCounter++;
        return ret;
    }
}

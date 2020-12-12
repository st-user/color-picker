export default class CurrentEventXY {

    #currentEventX;
    #currentEventY;

    x() {
        return this.#currentEventX;
    }

    y() {
        return this.#currentEventY;
    }

    exists() {
        return this.#currentEventX && this.#currentEventY;
    }

    set(xy) {
        if (xy.x) {
            this.#currentEventX = xy.x;
        }
        if (xy.y) {
            this.#currentEventY = xy.y;
        }
    }

    changeCurrentEventX(diff, contains) {
        const currentEventX = this.#currentEventX;

        if (!currentEventX) {
            return false;
        }
        const newX = currentEventX + diff;
        if (contains(newX)) {
            this.#currentEventX = newX;
            return true;
        }
        return false;
    }

    changeCurrentEventY(diff, contains) {
        const currentEventY = this.#currentEventY;

        if (!currentEventY) {
            return false;
        }
        const newY = currentEventY + diff;
        if (contains(newY)) {
            this.#currentEventY = newY;
            return true;
        }
        return false;
    }
}

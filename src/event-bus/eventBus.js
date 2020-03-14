class _EventBus {

    constructor() {
        this.bus = {};
    }

    $on(id, callback) {
        this.bus[id] = callback;
    }

    $emit(id, ...payload) {
        this.bus[id](...payload);
    }
}

export const eventBus = new _EventBus();
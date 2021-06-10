import { EventHandle } from "../type";

type EventType = 'load' | 'ended' | 'catch';

type HandleMap = {
    [name: string]: EventHandle[]
}

export class EventBus {
    private handleMap: HandleMap = {};
    
    public on(type: EventType, fn: () => void) {
        this.handleMap[type]
            ? this.handleMap[type].push(fn)
            : this.handleMap[type] = [fn]
    }

    public off(type: EventType, fn: () => void) {
        fn ? this.handleMap[type] = this.handleMap[type].filter(handle => handle !== fn) : delete this.handleMap[type]
    }

    public emit(type: EventType) {
        this.handleMap[type] && this.handleMap[type].forEach(handle => handle())
    }
}
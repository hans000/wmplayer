declare type EventType = 'load' | 'ended' | 'catch';
export declare class EventBus {
    private handleMap;
    on(type: EventType, fn: () => void): void;
    off(type: EventType, fn: () => void): void;
    emit(type: EventType): void;
}
export {};

export default interface Sequence<T> {
    getCurrent(): T;
    
    next(): void;
}
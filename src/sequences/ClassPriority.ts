import Sequence from "./Sequence.ts";



export default class ClassPriority implements Sequence<number> {
    constructor(
        protected priority: number
    ) {}



    public unique(): number {
        this.next();
        return this.getCurrent();
    }



    // Sequence<number>
    public getCurrent(): number {
        return this.priority;
    }

    public next(): void {
        this.priority--;
    }
}
import Sequence from "./Sequence.ts";



export default class FibonacciSequence implements Sequence<number> {
    public constructor(
        protected a: number = 0,
        protected b: number = 1,
    ) {}



    public getCurrent(): number {
        return this.b;
    }

    public next(): void {
        const c = this.a + this.b;
        this.a = this.b;
        this.b = c;
    }
}
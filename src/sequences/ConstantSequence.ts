import Sequence from "./Sequence.ts";



export class ConstantSequence implements Sequence<number> {
    public constructor(
        protected constant: number
    ) {}



    public getCurrent(): number {
        return this.constant;
    }

    public next(): void {}
}
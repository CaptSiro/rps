import { SlotState } from "./SlotState.ts";
import { Opt } from "../types.ts";
import { is } from "../lib/std.ts";



export default class Slot<T> {
    public static extract<E>(slots: Slot<E>[]): E[] {
        const ret: E[] = [];

        for (const slot of slots) {
            const item = slot.getItem();
            if (!is(item)) {
                continue;
            }

            ret.push(item);
        }

        return ret;
    }



    public constructor(
        protected state: SlotState,
        protected item: Opt<T> = undefined,
    ) {}



    public getItem(): Opt<T> {
        return this.item;
    }

    public setItem(item: Opt<T>): void {
        this.item = item;
    }

    public getState(): SlotState {
        return this.state;
    }

    public setState(state: SlotState): void {
        this.state = state;
    }
}
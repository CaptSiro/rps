import Spell from "./spells/Spell.ts";
import Slot from "./Slot.ts";
import Sequence from "./sequences/Sequence.ts";
import { SlotState } from "./SlotState.ts";



export default class Deck {
    public static empty(def: number, additional: number, priceSequence: Sequence<number>): Deck {
        return new Deck(
            new Array(def).fill(null).map(() => new Slot(SlotState.DEFAULT)),
            new Array(additional).fill(null).map(() => new Slot(SlotState.OPEN)),
            priceSequence
        );
    }

    public static fit(def: Spell[], additional: Spell[], priceSequence: Sequence<number>): Deck {
        return new Deck(
            def.map(x => new Slot(SlotState.DEFAULT, x)),
            additional.map(x => new Slot(SlotState.OPEN, x)),
            priceSequence
        );
    }



    public constructor(
        protected def: Slot<Spell>[],
        protected additional: Slot<Spell>[],
        protected priceSequence: Sequence<number>,
    ) {}



    public getDefaultSlots(): Slot<Spell>[] {
        return this.def;
    }

    public getDefaultSpells(): Spell[] {
        return Slot.extract(this.def);
    }

    public getAdditionalSlots(): Slot<Spell>[] {
        return this.additional;
    }

    public getAdditionalSpells(): Spell[] {
        return Slot.extract(this.additional);
    }

    public getNextSlotPrice(): number {
        return this.priceSequence.getCurrent();
    }

    public purchaseSlot(): number {
        this.additional.push(new Slot(SlotState.OPEN));
        this.priceSequence.next();
        return this.priceSequence.getCurrent();
    }

    public getSpells(): Spell[] {
        return this.getDefaultSpells()
            .concat(this.getAdditionalSpells())
    }
}
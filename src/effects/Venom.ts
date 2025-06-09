import Effect from "./Effect.ts";
import Spell from "../spells/Spell.ts";
import Entity from "../entities/Entity.ts";



export type VenomPrefab = {
    name: string,
    lifespan: number,
    paralyzeChance: number,
}

export class Venom extends Effect {
    constructor(
        protected prefab: VenomPrefab,
        caster: Entity,
        target: Entity
    ) {
        super(caster, target, prefab.name, prefab.lifespan);
    }



    public isHarmful(): boolean {
        return true;
    }

    public async onSpellPerform(spell: Spell): Promise<boolean> {
        return Math.random() <= this.prefab.paralyzeChance;
    }
}
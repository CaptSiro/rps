import Effect, { EffectPrefab } from "./Effect.ts";
import Spell from "../spells/Spell.ts";



export type VenomPrefab = {
    name: string,
    lifespan: number,
    paralyzeChance: number,
} & EffectPrefab;

export class Venom extends Effect<VenomPrefab> {
    public async onSpellPerform(spell: Spell): Promise<boolean> {
        return Math.random() <= this.prefab.paralyzeChance;
    }
}
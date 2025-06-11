import Effect, { EffectPrefab } from "./Effect.ts";
import Spell from "../spells/Spell.ts";



export type FailSpellPrefab = {
    chanceToFail: number;
} & EffectPrefab;

export default class FailSpellPerform extends Effect<FailSpellPrefab> {
    public async onSpellPerform(spell: Spell): Promise<boolean> {
        return Math.random() < this.prefab.chanceToFail;
    }
}
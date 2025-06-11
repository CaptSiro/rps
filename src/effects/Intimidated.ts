import { EffectPrefab } from "./Effect.ts";
import Entity, { EntityStats } from "../entities/Entity.ts";
import CompoundEffect from "./CompoundEffect.ts";
import StatChange from "./StatChange.ts";
import { EffectType } from "./EffectType.ts";



export type IntimidatedPrefab = {
    strengthMultiplier: number,
    toughnessMultiplier: number,
} & EffectPrefab;

export default class Intimidated extends CompoundEffect<IntimidatedPrefab> {
    constructor(
        prefab: IntimidatedPrefab,
        caster: Entity,
        target: Entity
    ) {
        super(prefab, caster, target);
        
        this.add(new StatChange({
            name: "Intimidate strength decrease",
            type: EffectType.STATISTIC,
            stat: "strength",
            calculateStat: x => x * prefab.strengthMultiplier
        }, caster, target));

        this.add(new StatChange({
            name: "Intimidate toughness decrease",
            type: EffectType.STATISTIC,
            stat: "toughness",
            calculateStat: x => x * prefab.toughnessMultiplier
        }, caster, target));
    }
}
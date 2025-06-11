import CompoundEffect from "./CompoundEffect.ts";
import Entity from "../entities/Entity.ts";
import StatChange from "./StatChange.ts";
import { EffectType } from "./EffectType.ts";
import { EffectPrefab } from "./Effect.ts";
import DamageOverTime from "./DamageOverTime.ts";
import Damage, { DamageType } from "../health/Damage.ts";



export type BindingPrefab = {
    damageBase: number,
} & EffectPrefab;

export default class Binding extends CompoundEffect<BindingPrefab> {
    constructor(
        prefab: BindingPrefab,
        caster: Entity,
        target: Entity
    ) {
        super(prefab, caster, target);

        this.add(new StatChange({
            name: "Binding evasiveness decrease",
            type: EffectType.STATISTIC,
            stat: "evasiveness",
            calculateStat: x => x - 1
        }, caster, target));

        this.add(new DamageOverTime({
            name: "Binding suffocation damage",
            type: EffectType.HARMFUL,
            createBaseDamage: () => new Damage(
                DamageType.TRUE,
                prefab.damageBase
            ),
        }, caster, target));
    }
}
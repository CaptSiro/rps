import CompoundEffect from "./CompoundEffect.ts";
import FailSpellPerform from "./FailSpellPerform.ts";
import { EffectType } from "./EffectType.ts";
import DamageOverTime from "./DamageOverTime.ts";
import Damage, { DamageType } from "../health/Damage.ts";
import { EffectPrefab } from "./Effect.ts";



export type ConfusionPrefab = {
    power: number,
} & EffectPrefab;

export default class Confusion extends CompoundEffect<ConfusionPrefab> {
    public init(): void {
        this.add(new FailSpellPerform({
            name: "Confusion fail spell perform",
            lifespan: Number.POSITIVE_INFINITY,
            type: EffectType.STATISTIC,
            chanceToFail: 1
        }, this.caster, this.target));

        this.add(new DamageOverTime({
            name: "Confusion fail spell perform",
            lifespan: Number.POSITIVE_INFINITY,
            type: EffectType.STATISTIC,
            createBaseDamage: caster => new Damage(
                DamageType.TRUE,
                caster.getStats().strength,
                this.prefab.power
            )
        }, this.caster, this.target));
    }
}
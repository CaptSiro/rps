import Effect, { EffectPrefab } from "./Effect.ts";
import Damage from "../health/Damage.ts";
import { Immunity } from "../Immunity.ts";
import Entity from "../entities/Entity.ts";



export default class ShadowRealmEffect extends Effect {
    public constructor(
        protected prefab: EffectPrefab,
        caster: Entity,
        target: Entity
    ) {
        super(prefab, caster, target);
    }



    public onTakenDamage(damage: Damage): Immunity {
        return Immunity.IMMUNE;
    }

    public onEffectAdded(effect: Effect): Immunity {
        return Immunity.IMMUNE;
    }
}
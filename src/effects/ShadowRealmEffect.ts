import Effect, { EffectPrefab } from "./Effect.ts";
import Damage, { DamageType } from "../health/Damage.ts";
import { Immunity } from "../Immunity.ts";
import Entity from "../entities/Entity.ts";



export const prefab_shadowRealmEffect: EffectPrefab = {
    name: "Shadow Realm",
    lifespan: 2
}

export default class ShadowRealmEffect extends Effect {
    public constructor(
        protected prefab: EffectPrefab,
        caster: Entity,
        target: Entity
    ) {
        super(caster, target, prefab.name, prefab.lifespan);
    }



    public onTakenDamage(damage: Damage): Immunity {
        return Immunity.IMMUNE;
    }

    public onEffectAdded(effect: Effect): Immunity {
        return Immunity.IMMUNE;
    }
}
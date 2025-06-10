import Effect from "./Effect.ts";
import Entity, { EntityStats } from "../entities/Entity.ts";



export type IntimidatedPrefab = {
    name: string,
    lifetime?: number,
    strengthMultiplier: number,
    toughnessMultiplier: number,
}

export default class Intimidated extends Effect {
    public constructor(
        protected prefab: IntimidatedPrefab,
        caster: Entity,
        target: Entity
    ) {
        super(prefab, caster, target);
    }

    public modifyStats(stats: EntityStats): EntityStats {
        stats.strength *= this.prefab.strengthMultiplier;
        stats.toughness *= this.prefab.toughnessMultiplier;
        return stats;
    }
}
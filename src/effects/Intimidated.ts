import Effect, { EffectPrefab } from "./Effect.ts";
import { EntityStats } from "../entities/Entity.ts";



export type IntimidatedPrefab = {
    strengthMultiplier: number,
    toughnessMultiplier: number,
} & EffectPrefab;

export default class Intimidated extends Effect<IntimidatedPrefab> {
    public modifyStats(stats: EntityStats): EntityStats {
        stats.strength *= this.prefab.strengthMultiplier;
        stats.toughness *= this.prefab.toughnessMultiplier;
        return stats;
    }
}
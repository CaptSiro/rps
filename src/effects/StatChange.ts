import Effect, { EffectPrefab } from "./Effect.ts";
import { EntityStats } from "../entities/Entity.ts";



export type StatChangePrefab = {
    stat: keyof EntityStats,
    calculateStat: (x: number) => number,
} & EffectPrefab;

export default class StatChange extends Effect<StatChangePrefab> {
    public modifyStats(stats: EntityStats): EntityStats {
        stats[this.prefab.stat] = this.prefab.calculateStat(stats[this.prefab.stat]);
        return stats;
    }
}
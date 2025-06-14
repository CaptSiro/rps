import Effect, { EffectPrefab } from "./Effect.ts";
import { EntityStats } from "../entities/Entity.ts";
import { is } from "../../lib/std.ts";



export type StatChangePrefab = {
    stat: keyof EntityStats,
    nameTemplate?: (stat: string) => string,
    calculateStat: (x: number) => number,
} & EffectPrefab;

export default class StatChange extends Effect<StatChangePrefab> {
    public getName(): string {
        const template = this.prefab.nameTemplate;
        if (is(template)) {
            return template(this.prefab.stat);
        }

        return super.getName();
    }

    public modifyStats(stats: EntityStats): EntityStats {
        stats[this.prefab.stat] = this.prefab.calculateStat(stats[this.prefab.stat]);
        return stats;
    }
}
import Effect from "./Effect.ts";
import Entity, { EntityStats } from "../entities/Entity.ts";



export type StatChangePrefab<S extends keyof EntityStats> = {
    name: string,
    lifespan: number,
    stat: S,
    calculateStat: (x: EntityStats[S]) => EntityStats[S],
};

export default class StatChange<S extends keyof EntityStats> extends Effect {
    protected processed: number;

    public constructor(
        protected prefab: StatChangePrefab<S>,
        caster: Entity,
        target: Entity
    ) {
        super(caster, target, prefab.name);
        this.processed = 0;
    }



    public isHarmful(): boolean {
        return false;
    }

    public doRemove(): boolean {
        return this.processed >= this.prefab.lifespan;
    }

    public modifyStats(stats: EntityStats): EntityStats {
        stats[this.prefab.stat] = this.prefab.calculateStat(stats[this.prefab.stat]);
        return stats;
    }
}
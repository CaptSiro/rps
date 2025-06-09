import Effect from "./Effect.ts";
import Entity, { EntityStats } from "../entities/Entity.ts";



export type StatChangePrefab = {
    name: string,
    lifespan: number,
    stat: keyof EntityStats,
    calculateStat: (x: number) => number,
};

export default class StatChange extends Effect {
    protected processed: number;

    public constructor(
        protected prefab: StatChangePrefab,
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
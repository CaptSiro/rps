import Effect from "./Effect";
import { showInfo } from "../core";
import Entity from "../entities/Entity.ts";



export type DamageOnEventPrefab = {
    name: string,
    event: string,
    lifespan: number,
    calculateDamage: (caster: Entity, target: Entity) => number;
    reduceAble?: boolean,
}

export default class DamageOnEvent extends Effect {
    public constructor(
        protected prefab: DamageOnEventPrefab,
        caster: Entity,
        target: Entity
    ) {
        super(caster, target, prefab.name, prefab.lifespan);
    }



    public isHarmful(): boolean {
        return true;
    }

    public getPrefab(): DamageOnEventPrefab {
        return this.prefab;
    }

    public getRemovedMessage(): string {
        return this.target.getName() + ' healed ' + this.name;
    }

    public async proc(): Promise<void> {
        await showInfo([this.target.getName() + ' is affected by ' + this.name]);
        await this.target.takeDamage(this.prefab.calculateDamage(this.caster, this.target), false, this.prefab.reduceAble ?? false);
    }



    async onRoundEnd(): Promise<void> {
        await super.onRoundEnd();
        await this.proc();
    }
}

import Effect from "./Effect";
import { showInfo } from "../core";
import Entity from "../entities/Entity.ts";
import Damage from "../health/Damage.ts";



export type DamageOnEventPrefab = {
    name: string,
    event: string,
    lifespan: number,
    createBaseDamage: (caster: Entity, target: Entity) => Damage;
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
        await this.caster.dealDamage(
            this.target,
            this.prefab.createBaseDamage(this.caster, this.target)
        );
    }



    async onRoundEnd(): Promise<void> {
        await super.onRoundEnd();
        await this.proc();
    }
}

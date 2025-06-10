import Effect, { EffectPrefab } from "./Effect";
import { showInfo } from "../core";
import Entity from "../entities/Entity.ts";
import Damage from "../health/Damage.ts";



export type DamageOnEventPrefab = {
    event: string,
    createBaseDamage: (caster: Entity, target: Entity) => Damage;
    reduceAble?: boolean,
} & EffectPrefab;

export default class DamageOnEvent extends Effect<DamageOnEventPrefab> {
    public getRemovedMessage(): string {
        return this.target + ' healed ' + this;
    }

    public async proc(): Promise<void> {
        await showInfo([this.target + ' is affected by ' + this]);
        await this.caster.dealDamage(
            this.target,
            this.prefab.createBaseDamage(this.caster, this.target)
        );
    }

    public async onRoundEnd(): Promise<void> {
        await super.onRoundEnd();
        await this.proc();
    }
}

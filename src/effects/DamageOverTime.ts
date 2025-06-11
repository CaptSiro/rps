import Effect, { EffectPrefab } from "./Effect";
import { showInfo } from "../core";
import Entity from "../entities/Entity.ts";
import Damage from "../health/Damage.ts";



export type DamageOverTimePrefab = {
    createBaseDamage: (caster: Entity, target: Entity) => Damage;
} & EffectPrefab;

export default class DamageOverTime extends Effect<DamageOverTimePrefab> {
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

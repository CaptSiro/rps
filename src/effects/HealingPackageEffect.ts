import Effect, { EffectPrefab } from "./Effect.ts";
import Damage, { DamageType } from "../health/Damage.ts";
import { Immunity } from "../Immunity.ts";
import Heal from "../health/Heal.ts";



export type HealingPackageEffectPrefab = {
    percentageHealed: number,
} & EffectPrefab;

export default class HealingPackageEffect extends Effect<HealingPackageEffectPrefab> {
    protected used: boolean = false;

    public async onDamageTaken(damage: Damage): Promise<void> {
        if (damage.getType() === DamageType.TRUE || this.used) {
            return;
        }

        this.caster.heal(new Heal(
            damage.getBase() * this.prefab.percentageHealed,
        ));

        this.used = true;
    }

    public doRemove(): boolean {
        return !this.used && super.doRemove();
    }

    public getRemovedMessage(): string {
        if (this.used) {
            return "Healing Package was used";
        }

        return super.getRemovedMessage();
    }
}
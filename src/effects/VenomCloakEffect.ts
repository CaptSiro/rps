import Effect, { EffectPrefab } from "./Effect.ts";
import Damage, { DamageType } from "../health/Damage.ts";
import { Venom } from "./Venom.ts";
import { prefab_venom } from "./_prefabs_effect.ts";
import Entity from "../entities/Entity.ts";



export type VenomCloakEffectPrefab = {
    name: string,
    venomDoses: number,
    lifespan?: number,
} & EffectPrefab;

export default class VenomCloakEffect extends Effect<VenomCloakEffectPrefab> {
    protected venomDosesLeft: number;

    constructor(
        prefab: VenomCloakEffectPrefab,
        caster: Entity,
        target: Entity,
    ) {
        super(prefab, caster, target);
        this.venomDosesLeft = prefab.venomDoses;
    }



    public async onDamageTaken(damage: Damage): Promise<void> {
        if (damage.getType() !== DamageType.PHYSICAL || this.venomDosesLeft <= 0) {
            return;
        }

        await damage.getTarget().addEffect(new Venom(
            prefab_venom,
            this.caster,
            damage.getTarget())
        );

        this.venomDosesLeft--;
    }

    public doRemove(): boolean {
        return this.venomDosesLeft <= 0;
    }

    public getRemovedMessage(): string {
        return this.caster + " got rid of Venom Cloak";
    }
}
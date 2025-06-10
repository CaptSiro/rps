import Effect from "./Effect.ts";
import Damage, { DamageType } from "../health/Damage.ts";
import { Immunity } from "../Immunity.ts";
import { Venom } from "./Venom.ts";
import { prefab_venom } from "./prefabs.ts";
import Entity from "../entities/Entity.ts";



export type VenomCloakEffectPrefab = {
    name: string,
    venomDoses: number,
    lifespan?: number,
}

export default class VenomCloakEffect extends Effect {
    protected venomDosesLeft: number;

    constructor(
        protected prefab: VenomCloakEffectPrefab,
        caster: Entity,
        target: Entity,
    ) {
        super(prefab, caster, target);
        this.venomDosesLeft = this.prefab.venomDoses;
    }



    public async onTakenDamage(damage: Damage): Promise<Immunity> {
        if (damage.getType() === DamageType.PHYSICAL && this.venomDosesLeft > 0) {
            await damage.getTarget().addEffect(new Venom(
                prefab_venom,
                this.caster,
                damage.getTarget())
            );

            this.venomDosesLeft--;
        }

        return Immunity.NOT_IMMUNE;
    }

    public doRemove(): boolean {
        return this.venomDosesLeft <= 0;
    }

    public getRemovedMessage(): string {
        return this.caster + " got rid of Venom Cloak";
    }
}
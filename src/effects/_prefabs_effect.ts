import { DamageOverTimePrefab } from "./DamageOverTime.ts";
import { StatChangePrefab } from "./StatChange.ts";
import { VenomPrefab } from "./Venom.ts";
import { instantiate } from "../core.ts";
import Damage, { DamageType } from "../health/Damage.ts";
import { EffectPrefab } from "./Effect.ts";
import { VenomCloakEffectPrefab } from "./VenomCloakEffect.ts";
import { IntimidatedPrefab } from "./Intimidated.ts";
import { EffectType } from "./EffectType.ts";
import { BindingPrefab } from "./Binding.ts";
import { ConfusionPrefab } from "./Confusion.ts";
import { HealingPackageEffectPrefab } from "./HealingPackageEffect.ts";



export const prefab_bleeding: DamageOverTimePrefab = {
    name: 'Bleeding',
    type: EffectType.HARMFUL,
    lifespan: 5,
    createBaseDamage: (caster, target) => new Damage(
        DamageType.TRUE,
        target.getMaxHealth() * 0.02
    ),
};

export function createBleedingPrefab(dexterity: number): DamageOverTimePrefab {
    const bleeding = instantiate(prefab_bleeding);

    bleeding.createBaseDamage = () => new Damage(
        DamageType.TRUE,
        dexterity * 0.3
    );

    return bleeding;
}

export const prefab_sharpStatIncrease: StatChangePrefab = {
    name: "Sharp stat increase",
    nameTemplate: stat => `"Sharp ${stat} increase"`,
    type: EffectType.STATISTIC,
    lifespan: 3,
    stat: "luck",
    calculateStat: x => x * 1.50,
};

export const prefab_venom: VenomPrefab = {
    name: "Venom",
    type: EffectType.HARMFUL,
    lifespan: Number.POSITIVE_INFINITY,
    paralyzeChance: 0.1,
};

export const prefab_shadowRealmEffect: EffectPrefab = {
    name: "Shadow Realm",
    type: EffectType.LOCATION,
    lifespan: 1
};

export const prefab_venomCloakEffect: VenomCloakEffectPrefab = {
    name: "Venom Cloak",
    type: EffectType.DEFENSE,
    lifespan: Number.POSITIVE_INFINITY,
    venomDoses: 3,
};

export const prefab_intimidated: IntimidatedPrefab = {
    name: "Intimidated",
    type: EffectType.STATISTIC,
    lifespan: Number.POSITIVE_INFINITY,
    strengthMultiplier: 0.9,
    toughnessMultiplier: 0.9,
};

export const prefab_binding: BindingPrefab = {
    name: "Binding",
    type: EffectType.STATISTIC,
    lifespan: 3,
    damageBase: 1
};

export const prefab_confusion: ConfusionPrefab = {
    name: "Confusion",
    type: EffectType.STATISTIC,
    lifespan: 1,
    power: 10
};

export const prefab_healingPackageEffect: HealingPackageEffectPrefab = {
    name: "Healing Package",
    type: EffectType.DEFENSE,
    lifespan: 5,
    percentageHealed: .80
}

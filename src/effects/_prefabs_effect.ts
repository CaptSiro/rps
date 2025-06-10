import { GAME_EVENT_ROUND_END } from "../GameEvent.ts";
import { DamageOnEventPrefab } from "./DamageOnEvent.ts";
import { StatChangePrefab } from "./StatChange.ts";
import { VenomPrefab } from "./Venom.ts";
import { instantiate } from "../core.ts";
import Damage, { DamageType } from "../health/Damage.ts";
import { EffectPrefab } from "./Effect.ts";
import { VenomCloakEffectPrefab } from "./VenomCloakEffect.ts";
import { IntimidatedPrefab } from "./Intimidated.ts";
import { EffectType } from "./EffectType.ts";



export const prefab_bleeding: DamageOnEventPrefab = {
    name: 'Bleeding',
    type: EffectType.HARMFUL,
    lifespan: 5,
    event: GAME_EVENT_ROUND_END,
    createBaseDamage: (caster, target) => new Damage(
        DamageType.TRUE,
        target.getMaxHealth() * 0.02
    ),
};

export function createBleedingPrefab(dexterity: number): DamageOnEventPrefab {
    const bleeding = instantiate(prefab_bleeding);

    bleeding.createBaseDamage = () => new Damage(
        DamageType.TRUE,
        dexterity * 0.3
    );

    return bleeding;
}

export const prefab_sharpSpeedIncrease: StatChangePrefab = {
    name: "Sharp speed increase",
    type: EffectType.STATISTIC,
    lifespan: 3,
    stat: "evasiveness",
    calculateStat: (speed) => speed + 0.5,
}

export const prefab_venom: VenomPrefab = {
    name: "Venom",
    type: EffectType.HARMFUL,
    lifespan: Number.POSITIVE_INFINITY,
    paralyzeChance: 0.1,
}

export const prefab_shadowRealmEffect: EffectPrefab = {
    name: "Shadow Realm",
    type: EffectType.LOCATION,
    lifespan: 1
}

export const prefab_venomCloakEffect: VenomCloakEffectPrefab = {
    name: "Venom Cloak",
    type: EffectType.DEFENSE,
    lifespan: Number.POSITIVE_INFINITY,
    venomDoses: 3,
}

export const prefab_intimidated: IntimidatedPrefab = {
    name: "Intimidated",
    type: EffectType.STATISTIC,
    lifespan: Number.POSITIVE_INFINITY,
    strengthMultiplier: 0.9,
    toughnessMultiplier: 0.9,
}

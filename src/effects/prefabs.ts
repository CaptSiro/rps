import { GAME_EVENT_ROUND_END } from "../GameEvent.ts";
import { DamageOnEventPrefab } from "./DamageOnEvent.ts";
import { StatChangePrefab } from "./StatChange.ts";
import { VenomPrefab } from "./Venom.ts";
import { instantiate } from "../core.ts";
import Damage, { DamageType } from "../health/Damage.ts";
import { EffectPrefab } from "./Effect.ts";



export const prefab_bleeding: DamageOnEventPrefab = {
    name: 'Bleeding',
    event: GAME_EVENT_ROUND_END,
    lifespan: 5,
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
    lifespan: 3,
    stat: "evasiveness",
    calculateStat: (speed) => speed + 0.5,
}

export const prefab_venom: VenomPrefab = {
    name: "Venom",
    lifespan: Number.POSITIVE_INFINITY,
    paralyzeChance: 0.1,
}

export const prefab_shadowRealmEffect: EffectPrefab = {
    name: "Shadow Realm",
    lifespan: 1
}

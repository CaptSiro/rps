import { GAME_EVENT_ROUND_END } from "../GameEvent.ts";
import { DamageOnEventPrefab } from "./DamageOnEvent.ts";
import { StatChangePrefab } from "./StatChange.ts";
import { VenomPrefab } from "./Venom.ts";



export const prefab_bleeding: DamageOnEventPrefab = {
    name: 'Bleeding',
    event: GAME_EVENT_ROUND_END,
    lifespan: 5,
    calculateDamage: (caster, target) => target.getMaxHealth() * 0.02,
};

export const prefab_sharpSpeedIncrease: StatChangePrefab<"speed"> = {
    name: "Sharp speed increase",
    lifespan: 3,
    stat: "speed",
    calculateStat: (speed) => speed + 0.5,
}

export const prefab_venom: VenomPrefab = {
    name: "Venom",
    lifespan: Number.POSITIVE_INFINITY,
    paralyzeChance: 0.1,
}

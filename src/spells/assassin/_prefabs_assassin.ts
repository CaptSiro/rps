import { SpellPrefab } from "../Spell.ts";
import { prefab_assassin } from "../class/prefabs.ts";



export const prefab_bloodBurst: SpellPrefab = {
    name: "Blood Burst",
    description: "Strike the target for moderate amount of damage. Add or replenish Bleeding effect for 5 rounds on target. If the target was bleeding before the strike, deal double the base damage",
    class: prefab_assassin,
    power: 40,
};

export const prefab_deathsDance: SpellPrefab = {
    name: "Death's Dance",
    description: "Sharply increases evasion for 3 rounds",
    class: prefab_assassin,
};

export const prefab_perfectExecution: SpellPrefab = {
    name: "Perfect Execution",
    description: "If the target is below 20% health execute the target immediately, if not Perfect Execution fails",
    class: prefab_assassin,
    power: Number.POSITIVE_INFINITY
};

export const prefab_scissors: SpellPrefab = {
    name: 'Scissors',
    description: 'Cut opponent for small amount of damage and add one stack of bleeding.',
    class: prefab_assassin,
    power: 20,
};

export const prefab_serpentFang: SpellPrefab = {
    name: "Serpent Fang",
    description: "Deal a small amount of damage and apply Venom effect",
    class: prefab_assassin,
    power: 20,
};

export const prefab_shadowRealm: SpellPrefab = {
    name: "Shadow Realm",
    description: "Caster moves to the Shadow Realm. The next round caster emerges from the Shadow Realm evading incoming spell entirely or striking with 250% efficiency",
    class: prefab_assassin,
};

export const prefab_venomCloak: SpellPrefab = {
    name: "Venom Cloak",
    description: "The caster puts on Venom Cloak that adds stack of venom to target it physical spell was used. This cloak stays on until the venom stacks are used up",
    class: prefab_assassin,
};

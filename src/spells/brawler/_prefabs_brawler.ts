import { SpellPrefab } from "../Spell.ts";
import { prefab_brawler } from "../class/_prefabs_classes.ts";
import { HeadbuttPrefab } from "./Headbutt.ts";



export const prefab_rock: SpellPrefab = {
    name: 'Rock',
    description: 'Deal heavy blow. The damage is bigger the lower the enemy\'s health is.',
    class: prefab_brawler,
    power: 40,
};

export const prefab_flex: SpellPrefab = {
    name: "Flex",
    description: "Caster and target flexes their strength. The stronger will intimidate the weaker lowering their strength and toughness. Intimidation stacks upto 3 times",
    class: prefab_brawler,
};

export const prefab_deathGrip: SpellPrefab = {
    name: "Death Grip",
    description: "Deal small amount of damage and Binding effect",
    class: prefab_brawler,
};

export const prefab_furyPunch: SpellPrefab = {
    name: "Fury Punch",
    description: "Deal small to large amount of damage to the target scaling from caster's missing health",
    class: prefab_brawler,
    power: 60,
};

export const prefab_headbutt: HeadbuttPrefab = {
    name: "Headbutt",
    description: "Deal large amount of damage to the target. The caster takes 20% damage dealt. Caster and target have a chance to be affected by Confusion for next round",
    class: prefab_brawler,
    power: 50,
    confusionChance: .33,
};

export const prefab_berserk: SpellPrefab = {
    name: "Berserk",
    description: "The caster goes berserk and deals moderate damage 3-5 times and takes 20% of damage dealt as consequence",
    class: prefab_brawler,
    power: 30,
};

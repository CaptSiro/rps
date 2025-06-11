import { SpellPrefab } from "../Spell.ts";
import { prefab_brawler } from "../class/prefabs.ts";



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

import { SpellPrefab } from "../Spell.ts";
import { prefab_cleric } from "../class/prefabs.ts";



export const prefab_paper: SpellPrefab = {
    name: 'Paper',
    description: 'Heals caster, removes one harmful effect, and disables opponent\'s spell for 1 round',
    class: prefab_cleric,
    power: 20,
};
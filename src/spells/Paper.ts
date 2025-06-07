import Spell, { SpellPrefab } from "./Spell";
import { showInfo } from "../core";
import Entity from "../entities/Entity.ts";
import { prefab_caster } from "./class/Caster.ts";
import { is } from "../../lib/std.ts";



export const prefab_paper: SpellPrefab = {
    title: 'Paper',
    description: 'Heals caster, removes one harmful effect, and disables opponent\'s spell for 1 round',
    type: prefab_caster,
};

export default class Paper extends Spell {
    async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        caster.heal(caster.getStats().intelligence * 2);

        const [effect, index] = caster.findEffect(effect => effect.isHarmful());
        if (!is(effect)) {
            return;
        }

        caster.getEffects().splice(index, 1);

        await showInfo([
            caster.getName() + ' healed'
        ]);
    }
}
import Spell, { SpellPrefab } from "../Spell.ts";
import { showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import { is } from "../../../lib/std.ts";
import { prefab_cleric } from "../class/prefabs.ts";



export const prefab_paper: SpellPrefab = {
    title: 'Paper',
    description: 'Heals caster, removes one harmful effect, and disables opponent\'s spell for 1 round',
    class: prefab_cleric,
};

export default class Paper extends Spell {
    async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const info = showInfo([
            caster.getName() + ' healed'
        ]);

        caster.heal(caster.getStats().intelligence * 2);

        const [effect, index] = caster.findEffect(effect => effect.isHarmful());
        if (!is(effect)) {
            await info;
            return;
        }

        caster.getEffects().splice(index, 1);
        await info;
    }
}
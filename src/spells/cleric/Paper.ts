import Spell, { SpellPrefab } from "../Spell.ts";
import { power, showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import { is } from "../../../lib/std.ts";
import { prefab_cleric } from "../class/prefabs.ts";
import Heal from "../../health/Heal.ts";



export const prefab_paper: SpellPrefab = {
    name: 'Paper',
    description: 'Heals caster, removes one harmful effect, and disables opponent\'s spell for 1 round',
    class: prefab_cleric,
    power: 20,
};

export default class Paper extends Spell {
    async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const info = showInfo([
            caster.getName() + ' healed'
        ]);

        caster.heal(new Heal(
            caster.getStats().intelligence,
            power(this.prefab, 20)
        ));

        const [effect, index] = caster.findEffect(effect => effect.isHarmful());
        if (!is(effect)) {
            await info;
            return;
        }

        await caster.removeEffect(index);
        await info;
    }
}
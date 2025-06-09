import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { showInfo } from "../../core.ts";
import { Venom } from "../../effects/Venom.ts";
import { prefab_venom } from "../../effects/prefabs.ts";



export default class SerpentFang extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([`${caster} stabbed ${target}, penetrating a small dose of venom into victim's body`]);
        const stats = caster.getStats();
        await target.takeDamage(stats.strength * (2/3), false, true);
        await target.addEffect(new Venom(prefab_venom, caster, target));
    }
}
import Spell, { SpellDefinition } from "./Spell";
import { showInfo } from "../core";
import Entity from "../entities/Entity.ts";
import DamageOnEvent, { prefab_bleeding } from "../effects/DamageOnEvent.ts";



export const prefab_scissors: SpellDefinition = {
    title: 'Scissors',
    description: 'Cut opponent for small amount of damage and add one stack of bleeding.'
};

export default class Scissors extends Spell {
    async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([caster.getName() + ' cut ' + target.getName()]);
        await target.takeDamage(caster.getDefinition().strength * 0.1 + target.getMaxHealth() * 0.05);
        await target.addEffect(new DamageOnEvent(prefab_bleeding, caster, target));
    }
}
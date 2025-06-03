import Effect from "./Effect";
import { showInfo } from "../core";



/**
 * @typedef {{ name: string, rounds: number, constant?: number, maxHealth?: number, currentHealth?: number, missingHealth?: number, reduceAble?: boolean }} DamageAfterRoundDefinition
 */

/** @type {DamageAfterRoundDefinition} */
export const prefab_bleeding = {
    name: 'Bleeding',
    rounds: 5,
    maxHealth: .05
};

export default class DamageAfterRound extends Effect {
    /** @type {DamageAfterRoundDefinition} */
    definition;
    processed;

    /**
     * @param {DamageAfterRoundDefinition} definition
     * @param {Entity} caster
     * @param {Entity} target
     */
    constructor(definition, caster, target) {
        super(caster, target, definition.name);
        this.definition = definition;
        this.processed = 0;
    }

    isHarmful() {
        return true;
    }

    /**
     * @returns {boolean}
     */
    doRemove() {
        return this.processed >= this.definition.rounds;
    }

    getRemovedMessage() {
        return this.target.getName() + ' healed ' + this.name;
    }

    calculateDamage() {
        return (this.definition.constant ?? 0)
            + this.target.getCurrentHealth() * (this.definition.currentHealth ?? 0)
            + this.target.getMaxHealth() * (this.definition.maxHealth ?? 0)
            + this.target.getMissingHealth() * (this.definition.missingHealth ?? 0);
    }

    async endOfRound() {
        await showInfo([this.target.getName() + ' is effected by ' + this.name]);
        await this.target.takeDamage(this.calculateDamage(), false, this.definition.reduceAble ?? false);
        this.processed++;
    }
}

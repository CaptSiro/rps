import { showInfo } from "../core";
import Health from "../components/Health";
import EmptySpell from "../spell/EmptySpell";
import SpellPreview from "../components/SpellPreview";



/**
 * @typedef {{ speed: 1, name: string, maxHealth: number, strength: number, toughness: number }} EntityDefinition
 */



/** @type {EntityDefinition} */
export const prefab_billy = {
    name: "Billy",
    maxHealth: 100,
    strength: 25,
    toughness: 10,
    speed: 1
};

export default class Entity {
    /**
     * @param {Entity[]} entities
     */
    static areAlive(entities) {
        for (const entity of entities) {
            if (!entity.isAlive()) {
                return false;
            }
        }

        return true;
    }



    /** @type {EntityDefinition} */
    definition;
    health;
    /** @type {Impulse<number>} */
    healthImpulse;
    healthBar;
    /** @type {Spell[]} */
    spells;
    /** @type {Effect[]} */
    effects;

    /**
     * @param {EntityDefinition} definition
     * @param {Spell[]} spells
     */
    constructor(definition, spells) {
        this.definition = definition;
        this.spells = spells;
        this.health = definition.maxHealth;
        this.healthImpulse = new Impulse({ default: 1, pulseOnDuplicate: true });
        this.healthBar = Health(this.healthImpulse);
        this.spellsImpulse = new Impulse({
            default: this.spells,
            pulseOnDuplicate: true
        });

        this.spellsPreview = SpellPreview(this.spellsImpulse);
        this.effects = [];
    }

    getMissingHealth() {
        return this.definition.maxHealth - this.health;
    }

    getCurrentHealth() {
        return this.health;
    }

    getMaxHealth() {
        return this.definition.maxHealth;
    }

    getName() {
        return this.definition.name;
    }

    newRound() {
        for (const spell of this.spells) {
            spell.disable(-1, false);
        }
    }

    /**
     * @param {string} name
     * @returns {Spell|undefined}
     */
    getSpell(name) {
        for (const spell of this.spells) {
            if (spell.getName() === name) {
                return spell;
            }
        }

        return undefined;
    }

    async addEffect(effect) {
        this.effects.push(effect);
        await effect.bind();
    }

    async endOfRound() {
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];
            await effect.endOfRound();

            if (!Entity.areAlive([effect.caster, effect.target])) {
                break;
            }

            if (!effect.doRemove()) {
                continue;
            }

            this.effects.splice(i, 1);
            await showInfo([effect.getRemovedMessage()]);
            i -= 1;
        }
    }

    isAlive() {
        return this.health > 0;
    }

    /**
     * @param {number} value
     * @param {boolean} evadeAble
     * @param {boolean} reduceAble
     * @returns {Promise<void>}
     */
    async takeDamage(value, evadeAble = true, reduceAble = true) {
        if (isNaN(value)) {
            throw new Error('Can not take NaN damage');
        }

        const chance = Math.max(Math.min(this.definition.speed - 1, 1), 0);
        if (Math.random() < chance && evadeAble) {
            await showInfo([this.getName() + ' evaded the attack']);
            return;
        }

        const reduce = this.definition.toughness === 0 || !reduceAble
            ? 1
            : (1 - 1 / this.definition.toughness);
        this.health -= value * reduce;

        if (this.health < 0) {
            this.health = 0;
        }

        this.healthImpulse.pulse(this.health / this.definition.maxHealth);
    }

    heal(value) {
        this.health += value;

        if (this.health > this.definition.maxHealth) {
            this.health = this.definition.maxHealth;
        }

        this.healthImpulse.pulse(this.health / this.definition.maxHealth);
    }

    /**
     * @return {Promise<Spell>}
     */
    async chooseSpell() {
        return this.getRandomAvailableSpell();
    }

    /**
     * @param {Spell} spell
     */
    addSpell(spell) {
        this.spells.push(spell);
        this.spellsImpulse.pulse(this.spells);
    }

    /**
     * @param {Spell[]} spells
     * @returns {Promise<void>}
     */
    async addOneSpell(spells) {
        this.addSpell(
            spells[Math.floor(Math.random() * spells.length)]
        );
    }

    /**
     * @return {Promise<Spell>}
     */
    async getRandomAvailableSpell() {
        return new Promise(resolve => {
            let index = Math.floor(Math.random() * this.getAvailableSpellCount());

            for (const spell of this.spells) {
                if (spell.isAvailable()) {
                    if (index-- === 0) {
                        resolve(spell);
                        return;
                    }
                }
            }

            resolve(new EmptySpell());
        });
    }

    getAvailableSpells() {
        return this.spells.filter(x => x.isAvailable());
    }

    getAvailableSpellCount() {
        return this.spells.reduce((sum, x) => sum + Number(x.isAvailable()), 0);
    }

    getSpells() {
        return this.spells;
    }

    getHtml() {
        return jsml.div({ class: 'entity' }, [
            jsml.h3({ class: 'name' }, this.definition.name),
            this.healthBar,
            this.spellsPreview
        ]);
    }
}
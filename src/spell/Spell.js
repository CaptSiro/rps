/**
 * @typedef {{ title: string, description: string, disabled?: number, uses?: number }} SpellDefinition
 */

const { div, span } = jsml;

export default class Spell {
    /** @type {SpellDefinition} */
    definition;
    disabled;
    uses;
    usesLeft;
    state;

    /**
     * @param {SpellDefinition} definition
     */
    constructor(definition) {
        this.definition = definition;
        this.disabled = definition.disabled ?? 0;
        this.uses = definition.uses ?? 1;
        this.usesLeft = this.uses;
        this.state = new Impulse({
            default: this,
            pulseOnDuplicate: true
        });
    }

    getName() {
        return this.definition.title;
    }

    isDisabled() {
        return this.disabled !== 0;
    }

    isAvailable() {
        return !this.isDisabled() && this.usesLeft > 0;
    }

    recharge() {
        this.usesLeft = this.uses;
        this.state.pulse(this);
    }

    /**
     * @param {number} rounds
     * @param {boolean} addCurrentRoundToCalculation
     */
    disable(rounds, addCurrentRoundToCalculation = true) {
        this.disabled += Math.round(rounds) + (addCurrentRoundToCalculation ? 1 : 0);

        if (this.disabled < 0) {
            this.disabled = 0;
        }

        this.state.pulse(this);
    }

    use() {
        this.usesLeft = Math.max(this.usesLeft - 1, 0);
        this.state.pulse(this);
    }

    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     * @return {Promise<void>}
     */
    async perform(caster, target, targetSpell) {
        throw new Error('Spell is not implemented');
    }

    getHtml() {
        let cssClass = '';
        if (this.isDisabled()) {
            cssClass = 'disabled';
        } else if (!this.isAvailable()) {
            cssClass = 'not-available';
        }

        return div({ class: "overlay-container " + cssClass }, [
            div({ class: 'disabled-overlay' },
                div({ class: 'circle' }, span(_, String(this.disabled)))
            ),
            div({ class: 'not-available-overlay' },
                div({ class: 'circle' }, span(_, 'X'))
            ),
            div({ class: 'title' }, this.definition.title),
            div({ class: 'description' }, this.definition.description),
        ]);
    }

    getPreviewHtml() {
        let cssClass = '';
        if (this.isDisabled()) {
            cssClass = 'disabled';
        } else if (!this.isAvailable()) {
            cssClass = 'not-available';
        }

        return jsml.div('overlay-container preview ' + cssClass, [
            div({ class: 'disabled-overlay' },
                span(_, String(this.disabled))
            ),
            div({ class: 'not-available-overlay' },
                span(_, 'X')
            ),
        ]);
    }
}
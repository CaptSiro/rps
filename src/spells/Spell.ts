import jsml, { _ } from "../../lib/jsml/jsml";
import Impulse from "../../lib/Impulse";
import Entity from "../entities/Entity.ts";



export type SpellDefinition = {
    title: string,
    description: string,

    disabled?: number,
    uses?: number
}

const { div, span } = jsml;



export default class Spell {
    protected readonly state: Impulse<Spell>;
    protected readonly uses: number;

    protected definition: SpellDefinition;
    protected disabled: number;
    protected usesLeft: number;



    public constructor(definition: SpellDefinition) {
        this.definition = definition;
        this.disabled = definition.disabled ?? 0;
        this.uses = definition.uses ?? 1;
        this.usesLeft = this.uses;
        this.state = new Impulse<Spell>({
            default: this,
            pulseOnDuplicate: true
        });
    }



    public isDisabled(): boolean {
        return this.disabled !== 0;
    }

    public isAvailable(): boolean {
        return !this.isDisabled() && this.usesLeft > 0;
    }

    public getDefinition(): SpellDefinition {
        return this.definition;
    }

    public getName(): string {
        return this.definition.title;
    }

    public getState(): Impulse<Spell> {
        return this.state;
    }

    public recharge(): void {
        this.usesLeft = this.uses;
        this.state.pulse(this);
    }

    public disable(rounds: number, addCurrentRoundToCalculation: boolean = true): void {
        this.disabled += Math.round(rounds) + Number(addCurrentRoundToCalculation);

        if (this.disabled < 0) {
            this.disabled = 0;
        }

        this.state.pulse(this);
    }

    public use(): void {
        this.usesLeft = Math.max(this.usesLeft - 1, 0);
        this.state.pulse(this);
    }

    public async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        throw new Error('Spell is not implemented');
    }

    public getHtml(): HTMLElement {
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

    public getPreviewHtml(): HTMLElement {
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
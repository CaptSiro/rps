import jsml, { _ } from "../../lib/jsml/jsml";
import Impulse from "../../lib/Impulse";
import Entity from "../entities/Entity.ts";
import SpellClass, { Outcome, ClassPrefab } from "./class/SpellClass.ts";



export type SpellPrefab = {
    title: string,
    description: string,
    class: ClassPrefab,

    disabled?: number,
    uses?: number
}

const { div, span } = jsml;



export default class Spell {
    protected readonly state: Impulse<Spell>;
    protected readonly uses: number;

    protected class: SpellClass;
    protected disabled: number;
    protected usesLeft: number;



    public constructor(
        protected prefab: SpellPrefab
    ) {
        this.class = new SpellClass(prefab.class);
        this.disabled = prefab.disabled ?? 0;

        this.uses = prefab.uses ?? 1;
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

    public getPrefab(): SpellPrefab {
        return this.prefab;
    }

    public getName(): string {
        return this.prefab.title;
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

    public compare(other: Spell): Outcome {
        return this.class.compare(other.class);
    }

    public getHtml(): HTMLElement {
        let cssClass = '';
        if (this.isDisabled()) {
            cssClass = 'disabled';
        } else if (!this.isAvailable()) {
            cssClass = 'not-available';
        }

        const backgroundColor = this.class.getColor().toString();
        return div({ class: "overlay-container " + cssClass, style: { backgroundColor } }, [
            div({ class: 'disabled-overlay' },
                div({ class: 'circle' }, span(_, String(this.disabled)))
            ),
            div({ class: 'not-available-overlay' },
                div({ class: 'circle' }, span(_, 'X'))
            ),
            div({ class: 'title' }, this.prefab.title),
            div({ class: 'description' }, this.prefab.description),
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
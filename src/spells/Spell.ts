import jsml, { _ } from "../../lib/jsml/jsml";
import Impulse from "../../lib/Impulse";
import Entity from "../entities/Entity.ts";
import SpellClass, { Outcome, ClassPrefab, WIN, LOSS } from "./class/SpellClass.ts";
import { showInfo } from "../core.ts";



export type SpellPrefab = {
    name: string,
    description: string,
    class: ClassPrefab,
    power?: number,

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
        return this.prefab.name;
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

    public performPolicy(outcome: Outcome, caster: Entity, target: Entity, targetSpell: Spell): boolean {
        return outcome === WIN;
    }

    public usePolicy(outcome: Outcome, caster: Entity, target: Entity, targetSpell: Spell): boolean {
        return outcome === LOSS;
    }

    public async perform(outcome: Outcome, caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        if (this.performPolicy(outcome, caster, target, targetSpell)) {
            if (await caster.onSpellPerform(this)) {
                await showInfo([
                    caster + ' wins the round.',
                    caster + ' used ' + this
                ]);
                await this.action(caster, target, targetSpell);
            }
        }

        if (this.usePolicy(outcome, caster, target, targetSpell)) {
            this.use();
        }
    }

    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {}

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
            div({ class: 'title' }, this.prefab.name),
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
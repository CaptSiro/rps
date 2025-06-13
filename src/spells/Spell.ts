import jsml, { _ } from "../../lib/jsml/jsml";
import Impulse from "../../lib/Impulse";
import Entity from "../entities/Entity.ts";
import SpellClass, { Outcome, ClassPrefab, WIN, LOSS } from "./class/SpellClass.ts";
import { showInfo } from "../core.ts";
import Color from "../Color.ts";



export type SpellPrefab = {
    name: string,
    description: string,
    class: ClassPrefab,
    power?: number,

    disabled?: number,
    uses?: number
}

const { div, span } = jsml;



export default class Spell<T extends SpellPrefab = SpellPrefab> {
    protected readonly state: Impulse<Spell>;
    protected readonly uses: number;

    protected class: SpellClass;
    protected disabled: number;
    protected usesLeft: number;
    protected played: number;



    public constructor(
        protected prefab: T
    ) {
        this.class = new SpellClass(prefab.class);
        this.disabled = prefab.disabled ?? 0;

        this.played = 0;
        this.uses = prefab.uses ?? 1;
        this.usesLeft = this.uses;

        this.state = new Impulse<Spell>({
            default: this,
            pulseOnDuplicate: true
        });
    }

    public toString(): string {
        return this.getName();
    }



    public isDisabled(): boolean {
        return this.disabled !== 0;
    }

    public isAvailable(): boolean {
        return !this.isDisabled() && this.usesLeft > 0;
    }

    public getName(): string {
        return this.prefab.name;
    }

    public getPriority(): number {
        if (this.played <= 0) {
            return Number.NEGATIVE_INFINITY;
        }

        return this.class.getPriority();
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
        this.played++;
        this.state.pulse(this);
    }

    public performPolicy(outcome: Outcome, caster: Entity, target: Entity, targetSpell: Spell): boolean {
        return outcome === WIN;
    }

    public usePolicy(outcome: Outcome, caster: Entity, target: Entity, targetSpell: Spell): boolean {
        return outcome !== LOSS;
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

    public copy(): Spell<T> {
        const constructor = Object.getPrototypeOf(this).constructor;
        return new constructor(this.prefab);
    }

    public getOverlayClass(): string {
        if (this.isDisabled()) {
            return 'disabled';
        }

        if (!this.isAvailable()) {
            return 'not-available';
        }

        return '';
    }

    public getHtml(): HTMLElement {
        const backgroundColor = this.class.getColor().toString();
        return div({ class: "spell full ", style: { backgroundColor } }, [
            div("overlay-container " + this.getOverlayClass(), [
                div({ class: 'disabled-overlay' },
                    div({ class: 'circle' }, span(_, String(this.disabled)))
                ),
                div({ class: 'not-available-overlay' },
                    div({ class: 'circle' }, span(_, 'X'))
                ),
            ]),

            div("spell-content", [
                div({ class: 'title' }, this.prefab.name),
                div({ class: 'description' }, this.prefab.description),
            ])
        ]);
    }

    public getClassColor(): string {
        if (this.played <= 0) {
            return Color.fromHex("#808080").toString();
        }

        return this.class.getColor().toString();
    }

    public getPreviewHtml(): HTMLElement {
        let cssClass = '';
        if (this.isDisabled()) {
            cssClass = 'disabled';
        } else if (!this.isAvailable()) {
            cssClass = 'not-available';
        }

        if (this.played <= 0) {
            cssClass += " unknown";
        }

        const backgroundColor = this.getClassColor();
        return jsml.div({ class: 'overlay-container preview ' + cssClass, style: { backgroundColor } }, [
            div('unknown-overlay', span(_, '?')),
            div('disabled-overlay', span(_, String(this.disabled))),
            div('not-available-overlay', span(_, 'X')),
        ]);
    }
}
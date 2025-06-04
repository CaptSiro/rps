import { showInfo } from "../core";
import Health from "../components/Health";
import SpellPreview from "../components/SpellPreview";
import Impulse from "../../lib/Impulse.ts";
import Spell from "../spells/Spell.ts";
import { Opt } from "../../lib/types.ts";
import None from "../spells/None.ts";
import jsml from "../../lib/jsml/jsml.ts";
import EntityEvent, { EntityEvent_onEvent } from "./EntityEvent.ts";
import Effect from "../effects/Effect.ts";



export type EntityDefinition = {
    name: string,
    maxHealth: number,
    strength: number,
    toughness: number,
    speed: 1,
}


export const prefab_billy: EntityDefinition = {
    name: "Billy",
    maxHealth: 100,
    strength: 25,
    toughness: 10,
    speed: 1
};

export default class Entity implements EntityEvent {
    public static areAlive(entities: Entity[]) {
        for (const entity of entities) {
            if (!entity.isAlive()) {
                return false;
            }
        }

        return true;
    }



    protected readonly definition: EntityDefinition;

    protected health: number;
    protected readonly healthImpulse: Impulse<number>;
    protected readonly healthBar: HTMLElement;

    protected readonly effects: Effect[];

    protected readonly spellsImpulse: Impulse<Spell[]>;
    protected readonly spellPreview: HTMLElement;



    constructor(
        definition: EntityDefinition,
        protected readonly spells: Spell[]
    ) {
        this.definition = definition;
        this.health = definition.maxHealth;
        this.healthImpulse = new Impulse({ default: 1, pulseOnDuplicate: true });
        this.healthBar = Health(this.healthImpulse);
        this.spellsImpulse = new Impulse<Spell[]>({
            default: this.spells,
            pulseOnDuplicate: true
        });

        this.spellPreview = SpellPreview(this.spellsImpulse);
        this.effects = [];
    }



    public isAlive(): boolean {
        return this.health > 0;
    }

    public getDefinition(): EntityDefinition {
        return this.definition;
    }

    public getMissingHealth(): number {
        return this.definition.maxHealth - this.health;
    }

    public getCurrentHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.definition.maxHealth;
    }

    public getName(): string {
        return this.definition.name;
    }

    public getSpell(name: string): Opt<Spell> {
        for (const spell of this.spells) {
            if (spell.getName() === name) {
                return spell;
            }
        }

        return undefined;
    }

    public async getRandomAvailableSpell(): Promise<Spell> {
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

            resolve(new None());
        });
    }

    public getSpells(): Spell[] {
        return this.spells;
    }

    public getAvailableSpells(): Spell[] {
        return this.spells.filter(x => x.isAvailable());
    }

    public getAvailableSpellCount(): number {
        return this.spells.reduce((sum, x) => sum + Number(x.isAvailable()), 0);
    }

    public addSpell(spell: Spell): void {
        this.spells.push(spell);
        this.spellsImpulse.pulse(this.spells);
    }

    public getEffects(): Effect[] {
        return this.effects;
    }

    async addEffect(effect: Effect): Promise<void> {
        this.effects.push(effect);
        await effect.onBind();
    }



    public async takeDamage(value: number, evadeAble: boolean = true, reduceAble: boolean = true): Promise<void> {
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

    public heal(value: number): void {
        this.health += value;

        if (this.health > this.definition.maxHealth) {
            this.health = this.definition.maxHealth;
        }

        this.healthImpulse.pulse(this.health / this.definition.maxHealth);
    }



    protected async propagateEventToEffects(event: string): Promise<void> {
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];
            await effect.onEvent(event);

            if (!Entity.areAlive([effect.getCaster(), effect.getTarget()])) {
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

    public async onRoundStart(): Promise<void> {
        for (const spell of this.spells) {
            spell.disable(-1, false);
        }
    }

    public async onRoundEnd(): Promise<void> {}

    public async onDrawSpells(spells: Spell[]): Promise<void> {
        this.addSpell(
            spells[Math.floor(Math.random() * spells.length)]
        );
    }

    public async onChooseSpell(): Promise<Spell> {
        return this.getRandomAvailableSpell();
    }

    public async onEvent(event: string): Promise<void> {
        return new Promise(resolve => {
            Promise.all([
                this.propagateEventToEffects(event),
                EntityEvent_onEvent(event, this)
            ]).then(() => resolve());
        });
    }



    public getHtml(): HTMLElement {
        return jsml.div({ class: 'entity' }, [
            jsml.h3({ class: 'name' }, this.definition.name),
            this.healthBar,
            this.spellPreview
        ]);
    }
}
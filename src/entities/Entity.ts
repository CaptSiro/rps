import { instantiate, showInfo } from "../core";
import Health from "../components/Health";
import SpellPreview from "../components/SpellPreview";
import Impulse from "../../lib/Impulse.ts";
import Spell from "../spells/Spell.ts";
import { Opt } from "../../types.ts";
import None from "../spells/None.ts";
import jsml from "../../lib/jsml/jsml.ts";
import Effect from "../effects/Effect.ts";
import { Predicate } from "../../types.ts";
import Battle from "../Battle.ts";



export type EntityStats = {
    maxHealth: number,
    strength: number,
    toughness: number,
    intelligence: number,
    dexterity: number,
    luck: number,
    speed: number,
}

export type EntityPrefab = {
    name: string,
    stats: EntityStats,
}


export const prefab_billy: EntityPrefab = {
    name: "Billy",
    stats: {
        maxHealth: 110,
        strength: 14,
        toughness: 14,
        dexterity: 6,
        intelligence: 5,
        luck: 10,
        speed: 1,
    },
};

export default class Entity {
    public static areAlive(entities: Entity[]) {
        for (const entity of entities) {
            if (!entity.isAlive()) {
                return false;
            }
        }

        return true;
    }



    protected battle: Battle | any;

    protected health: number;
    protected readonly healthImpulse: Impulse<number>;
    protected readonly healthBar: HTMLElement;

    protected readonly effects: Effect[];

    protected readonly spellsImpulse: Impulse<Spell[]>;
    protected readonly spellPreview: HTMLElement;



    constructor(
        protected readonly prefab: EntityPrefab,
        protected readonly spells: Spell[],
        protected readonly deck: () => Spell[],
    ) {
        this.health = prefab.stats.maxHealth;
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

    public getPrefab(): EntityPrefab {
        return this.prefab;
    }

    public getStats(): EntityStats {
        return this.effects.reduce(
            (stats, x) => x.modifyStats(stats),
            instantiate(this.prefab.stats)
        );
    }

    public getMissingHealth(): number {
        return this.prefab.stats.maxHealth - this.health;
    }

    public getCurrentHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.getStats().maxHealth;
    }

    public getName(): string {
        return this.prefab.name;
    }

    public getDeck(): Spell[] {
        return this.deck();
    }

    public getSpell(name: string): Opt<Spell> {
        for (const spell of this.spells) {
            if (spell.getName() === name) {
                return spell;
            }
        }

        return undefined;
    }

    public findSpell(predicate: Predicate<Spell>): Opt<[Spell, number]> {
        const index = this.spells.findIndex(x => predicate(x));
        if (index === -1) {
            return;
        }

        return [this.spells[index], index];
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

    public getEffect(name: string): Opt<Effect> {
        for (const effect of this.effects) {
            if (effect.getName() === name) {
                return effect;
            }
        }

        return undefined;
    }

    public findEffect(predicate: Predicate<Effect>): [Opt<Effect>, number] {
        const index = this.effects.findIndex(x => predicate(x));
        if (index === -1) {
            return [undefined, -1];
        }

        return [this.effects[index], index];
    }

    async addEffect(effect: Effect): Promise<void> {
        this.effects.push(effect);
        await effect.onBind();
    }



    public async takeDamage(value: number, evadeAble: boolean = true, reduceAble: boolean = true): Promise<void> {
        if (isNaN(value)) {
            throw new Error('Can not take NaN damage');
        }

        const chance = Math.max(Math.min(this.prefab.stats.speed - 1, 1), 0);
        if (Math.random() < chance && evadeAble) {
            await showInfo([this.getName() + ' evaded the attack']);
            return;
        }

        const reduce = this.prefab.stats.toughness === 0 || !reduceAble
            ? 1
            : (1 - 1 / this.prefab.stats.toughness);
        this.health -= value * reduce;

        if (this.health < 0) {
            this.health = 0;
        }

        this.healthImpulse.pulse(this.health / this.prefab.stats.maxHealth);
    }

    public heal(value: number): void {
        this.health += value;

        if (this.health > this.prefab.stats.maxHealth) {
            this.health = this.prefab.stats.maxHealth;
        }

        this.healthImpulse.pulse(this.health / this.prefab.stats.maxHealth);
    }



    protected async propagateEventToEffects(propagate: (x: Effect) => Promise<void>): Promise<void> {
        for (let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];
            await propagate(effect);

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

    public async onBattleStart(battle: Battle): Promise<void> {
        await this.propagateEventToEffects(x => x.onBattleStart());

        this.battle = battle;
    }

    public async onRoundStart(): Promise<void> {
        await this.propagateEventToEffects(x => x.onRoundStart());

        for (const spell of this.spells) {
            spell.disable(-1, false);
        }
    }

    public async onRoundEnd(): Promise<void> {
        await this.propagateEventToEffects(x => x.onRoundEnd());
    }

    public async onDrawSpells(spells: Spell[]): Promise<void> {
        this.addSpell(
            spells[Math.floor(Math.random() * spells.length)]
        );
    }

    public async onChooseSpell(): Promise<Spell> {
        return this.getRandomAvailableSpell();
    }



    public getHtml(): HTMLElement {
        return jsml.div({ class: 'entity' }, [
            jsml.h3({ class: 'name' }, this.prefab.name),
            this.healthBar,
            this.spellPreview
        ]);
    }
}
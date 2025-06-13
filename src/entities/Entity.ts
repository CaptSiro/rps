import { instantiate, showInfo, speed } from "../core";
import Health from "../components/Health";
import SpellPreview from "../components/SpellPreview";
import Impulse from "../../lib/Impulse.ts";
import Spell from "../spells/Spell.ts";
import { Opt, Predicate } from "../../types.ts";
import None from "../spells/None.ts";
import jsml from "../../lib/jsml/jsml.ts";
import Effect from "../effects/Effect.ts";
import Battle from "../Battle.ts";
import Damage from "../health/Damage.ts";
import { expFalloff, parallelize } from "../../lib/std.ts";
import Heal from "../health/Heal.ts";
import { Immunity } from "../Immunity.ts";
import BattleRecord from "../BattleRecord.ts";
import Deck from "../Deck.ts";



export type EntityStats = {
    maxHealth: number,
    strength: number,
    toughness: number,
    intelligence: number,
    dexterity: number,
    luck: number,
    evasiveness: number,
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
        evasiveness: 0,
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
    protected history: BattleRecord[];

    protected health: number;
    protected readonly healthImpulse: Impulse<number>;
    protected readonly healthBar: HTMLElement;

    protected readonly effects: Effect[];

    protected readonly spellsImpulse: Impulse<Spell[]>;
    protected readonly spellPreview: HTMLElement;



    constructor(
        protected readonly prefab: EntityPrefab,
        protected spells: Spell[],
        protected deck: Deck,
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
        this.history = [];
    }

    public toString(): string {
        return this.getName();
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

    public getDeck(): Deck {
        return this.deck;
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

    public getEffectStacks(predicate: Predicate<Effect>): number {
        return this.effects.reduce(
            (stacks, x) => stacks + Number(predicate(x)),
            0
        );
    }

    public findEffect(predicate: Predicate<Effect>): [Opt<Effect>, number] {
        const index = this.effects.findIndex(x => predicate(x));
        if (index === -1) {
            return [undefined, -1];
        }

        return [this.effects[index], index];
    }

    public async addEffect(effect: Effect): Promise<boolean> {
        if (await this.modifyAddedEffect(effect) === Immunity.IMMUNE) {
            await showInfo([this + " is immune to " + effect]);
            return false;
        }

        this.effects.push(effect);
        await effect.onBind();
        return true;
    }

    public async removeEffect(index: number): Promise<void> {
        const effect = this.effects[index];
        this.effects.splice(index, 1);

        await effect.onRemove();
        await showInfo([effect.getRemovedMessage()]);
    }



    public modifyDamage(damage: Damage): Damage {
        return this.effects.reduce(
            (d, x) => x.modifyDamage(d),
            damage
        );
    }

    public modifyDamageTaken(damage: Damage): Immunity {
        for (const effect of this.effects) {
            if (effect.modifyDamageTaken(damage) === Immunity.IMMUNE) {
                return Immunity.IMMUNE;
            }
        }

        return Immunity.NOT_IMMUNE;
    }

    public modifyHeal(heal: Heal): Heal {
        return this.effects.reduce(
            (h, x) => x.modifyHeal(h),
            heal
        );
    }

    public async modifyAddedEffect(effect: Effect): Promise<Immunity> {
        for (const effect of this.effects) {
            if (await effect.onEffectAdded(effect) === Immunity.IMMUNE) {
                return Immunity.IMMUNE;
            }
        }

        return Immunity.NOT_IMMUNE;
    }

    public async dealDamage(target: Entity, damage: Damage): Promise<number> {
        damage.setInitiator(this);
        damage.setTarget(target);
        return await target.takeDamage(this, this.modifyDamage(damage));
    }

    public async onDamageTaken(damage: Damage): Promise<void> {
        await parallelize(this.effects, x => x.onDamageTaken(damage));
    }

    protected async takeDamage(initiator: Entity, damage: Damage): Promise<number> {
        if (isNaN(damage.getBase())) {
            throw new Error('Can not take NaN damage');
        }

        const stats = this.getStats();
        if (damage.isAvoidable()) {
            const chance = expFalloff(speed(stats.evasiveness));
            if (Math.random() < chance) {
                await showInfo([initiator + ' missed']);
                return 0;
            }
        }

        if (this.modifyDamageTaken(damage) === Immunity.IMMUNE) {
            await showInfo([this + " is immune"]);
            return 0;
        }

        const resistance = stats.toughness / 50;
        const absorption = Math.max(0, expFalloff(resistance));
        const amount = damage.getAmount(absorption);
        const dealt = Math.min(this.health, amount);

        this.health -= dealt;

        const damageDealt = new Damage(
            damage.getType(),
            dealt,
            damage.getPower(),
        );
        damageDealt.setInitiator(damage.getInitiator());
        damageDealt.setTarget(damage.getTarget());

        await this.onDamageTaken(damageDealt);

        if (this.health <= 0) {
            this.health = 0;
        }

        this.healthImpulse.pulse(this.health / this.prefab.stats.maxHealth);
        return dealt;
    }

    public heal(heal: Heal): void {
        this.health += this.modifyHeal(heal).getAmount();

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

            await this.removeEffect(i);
            i -= 1;
        }
    }

    public record(record: BattleRecord): void {
        this.history.push(record);
    }

    public async onBattleStart(battle: Battle): Promise<void> {
        this.battle = battle;
        this.spells = this.deck.getDefaultSpells().map(x => x.copy());
        this.spellsImpulse.pulse(this.spells);

        await this.propagateEventToEffects(x => x.onBattleStart());
    }

    public async onRoundStart(): Promise<void> {
        await this.propagateEventToEffects(x => x.onRoundStart());

        for (const spell of this.spells) {
            spell.disable(-1, false);
        }
    }

    public async onSpellPerform(spell: Spell): Promise<boolean> {
        for (const effect of this.effects) {
            if (!await effect.onSpellPerform(spell)) {
                return false;
            }
        }

        return true;
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
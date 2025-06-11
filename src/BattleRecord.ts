import Entity from "./entities/Entity.ts";
import { Outcome } from "./spells/class/SpellClass.ts";
import Spell from "./spells/Spell.ts";



export default class BattleRecord {
    public constructor(
        protected entity: Entity,
        protected spell: Spell,
        protected outcome: Outcome,
        protected reward: number,
    ) {}



    public getEntity(): Entity {
        return this.entity;
    }

    public getSpell(): Spell {
        return this.spell;
    }

    public getOutcome(): Outcome {
        return this.outcome;
    }

    public getReward(): number {
        return this.outcome * this.reward;
    }
}
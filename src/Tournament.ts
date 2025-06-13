import Entity, { EntityStats } from "./entities/Entity.ts";
import Deck from "./Deck.ts";
import Battle from "./Battle.ts";
import { Opt } from "../types.ts";
import { assert } from "../lib/std.ts";
import Impulse from "../lib/Impulse.ts";
import jsml from "../lib/jsml/jsml.ts";



export default class Tournament {
    protected current: Opt<Battle>;
    protected currentOpponent: number;
    protected readonly balanceImpulse: Impulse<number>;

    public constructor(
        protected player: Entity,
        protected stats: EntityStats,
        protected balance: number,
        protected opponents: Entity[]
    ) {
        this.currentOpponent = 0;
        this.balanceImpulse = new Impulse({ default: this.balance });
    }



    public getPlayer(): Entity {
        return this.player;
    }

    public getStats(): EntityStats {
        return this.stats;
    }

    public getBalance(): number {
        return this.balance;
    }

    public setBalance(balance: number): void {
        this.balance = Math.round(balance);
        this.balanceImpulse.pulse(this.balance);
    }

    public addBalance(difference: number): void {
        this.setBalance(this.getBalance() + difference);
    }

    public getBattle(): Battle {
        return assert(this.current);
    }

    public isCompleted(): boolean {
        return this.opponents.length === this.currentOpponent;
    }

    public nextBattle(): Battle {
        const opponent = this.opponents[this.currentOpponent++];

        return new Battle(
            this,
            opponent,
            this.player
        );
    }

    public getBalanceHtml(): HTMLElement {
        return jsml.span("balance", this.balanceImpulse);
    }
}
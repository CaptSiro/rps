import Entity, { EntityStats } from "./entities/Entity.ts";
import Deck from "./Deck.ts";
import Battle from "./Battle.ts";
import { Opt } from "../types.ts";
import { assert } from "../lib/std.ts";
import Opponent from "./Opponent.ts";



export default class Tournament {
    protected current: Opt<Battle>;
    protected currentOpponent: number;

    public constructor(
        protected player: Entity,
        protected stats: EntityStats,
        protected deck: Deck,
        protected balance: number,
        protected opponents: Opponent[]
    ) {
        this.currentOpponent = 0;
    }



    public getPlayer(): Entity {
        return this.player;
    }

    public getStats(): EntityStats {
        return this.stats;
    }

    public getDeck(): Deck {
        return this.deck;
    }

    public getBalance(): number {
        return this.balance;
    }

    public setBalance(balance: number): void {
        this.balance = Math.round(balance);
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
            opponent.getEntity(),
            this.player
        );
    }
}
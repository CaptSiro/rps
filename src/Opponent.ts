import Entity from "./entities/Entity.ts";
import Deck from "./Deck.ts";



export default class Opponent {
    public constructor(
        protected entity: Entity,
        protected deck: Deck
    ) {}



    public getEntity(): Entity {
        return this.entity;
    }

    public getDeck(): Deck {
        return this.deck;
    }
}
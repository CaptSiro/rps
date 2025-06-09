import { playerChooseNewSpell, playerChooseSpell } from "../core";
import Entity, { EntityPrefab } from "./Entity";
import Rock, { prefab_rock } from "../spells/brawler/Rock.ts";
import Paper, { prefab_paper } from "../spells/cleric/Paper.ts";
import Scissors, { prefab_scissors } from "../spells/assassin/Scissors.ts";
import jsml from "../../lib/jsml/jsml.ts";
import Spell from "../spells/Spell.ts";
import Slingshot, { prefab_slingshot } from "../spells/ranger/Slingshot.ts";



export const prefab_player: EntityPrefab = {
    name: "Player",
    stats: {
        maxHealth: 100,
        strength: 10,
        toughness: 10,
        intelligence: 10,
        dexterity: 10,
        luck: 10,
        speed: 1
    },
}

export function prefab_playerInitialSpells(): Spell[] {
    return [new Rock(prefab_rock), new Paper(prefab_paper), new Scissors(prefab_scissors)];
}

export function prefab_playerDeck(): Spell[] {
    return [new Rock(prefab_rock), new Paper(prefab_paper), new Scissors(prefab_scissors), new Slingshot(prefab_slingshot)];
}

export default class Player extends Entity {
    public async onChooseSpell(): Promise<Spell> {
        return await playerChooseSpell(this.spells);
    }

    public async onDrawSpells(spells: Spell[]): Promise<void> {
        this.addSpell(
            await playerChooseNewSpell(spells)
        );
    }

    getHtml() {
        return jsml.div({ class: 'entity player' }, [
            jsml.h3({ class: 'name' }, this.prefab.name),
            this.healthBar,
            this.spellPreview
        ]);
    }
}
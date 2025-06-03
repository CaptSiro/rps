import { playerChooseNewSpell, playerChooseSpell } from "../core";
import Entity, { EntityDefinition } from "./Entity";
import Rock, { prefab_rock } from "../spells/Rock.ts";
import Paper, { prefab_paper } from "../spells/Paper.ts";
import Scissors, { prefab_scissors } from "../spells/Scissors.ts";
import jsml from "../../lib/jsml/jsml.ts";
import Spell from "../spells/Spell.ts";



export const prefab_player: EntityDefinition = {
    name: "Player",
    maxHealth: 100,
    strength: 20,
    toughness: 10,
    speed: 1
}

export function prefab_playerSpells() {
    return [new Rock(prefab_rock), new Paper(prefab_paper), new Scissors(prefab_scissors)];
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
            jsml.h3({ class: 'name' }, this.definition.name),
            this.healthBar,
            this.spellPreview
        ]);
    }
}
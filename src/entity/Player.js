import Rock, { prefab_rock } from "../spell/Rock";
import Paper, { prefab_paper } from "../spell/Paper";
import Scissors, { prefab_scissors } from "../spell/Scissors";
import { playerChooseNewSpell, playerChooseSpell } from "../core";
import Entity from "./Entity";



/** @type {EntityDefinition} */
export const prefab_player = {
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
    /**
     * @return {Promise<Spell>}
     */
    async chooseSpell() {
        return await playerChooseSpell(this.spells);
    }

    async addOneSpell(spells) {
        this.addSpell(
            await playerChooseNewSpell(spells)
        );
    }

    getHtml() {
        return jsml.div({ class: 'entity player' }, [
            jsml.h3({ class: 'name' }, this.definition.name),
            this.healthBar,
            this.spellsPreview
        ]);
    }
}
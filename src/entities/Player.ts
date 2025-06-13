import { playerChooseNewSpell, playerChooseSpell } from "../core";
import Entity, { EntityPrefab } from "./Entity";
import jsml from "../../lib/jsml/jsml.ts";
import Spell from "../spells/Spell.ts";
import Slingshot, { prefab_slingshot } from "../spells/ranger/Slingshot.ts";
import Rock from "../spells/brawler/Rock.ts";
import { prefab_rock } from "../spells/brawler/_prefabs_brawler.ts";
import Paper from "../spells/cleric/Paper.ts";
import { prefab_paper } from "../spells/cleric/_prefabs_cleric.ts";
import Scissors from "../spells/assassin/Scissors.ts";
import { prefab_scissors } from "../spells/assassin/_prefabs_assassin.ts";
import BattleRecord from "../BattleRecord.ts";
import Battle from "../Battle.ts";



export const prefab_player: EntityPrefab = {
    name: "Player",
    stats: {
        maxHealth: 100,
        strength: 10,
        toughness: 10,
        intelligence: 10,
        dexterity: 10,
        luck: 10,
        evasiveness: 0
    },
}

export function prefab_playerInitialSpells(): Spell[] {
    return [new Rock(prefab_rock), new Paper(prefab_paper), new Scissors(prefab_scissors)];
}

export function prefab_playerDeck(): Spell[] {
    return [new Rock(prefab_rock), new Paper(prefab_paper), new Scissors(prefab_scissors), new Slingshot(prefab_slingshot)];
}

export default class Player extends Entity {
    public record(record: BattleRecord) {
        super.record(record);

        const battle = this.battle;
        if (battle instanceof Battle) {
            console.log(record.getReward());
            battle.getTournament().addBalance(
                Math.max(0, record.getReward())
            );
        }
    }

    public async onChooseSpell(): Promise<Spell> {
        return await playerChooseSpell(this.spells);
    }

    public async onDrawSpells(spells: Spell[]): Promise<void> {
        this.addSpell(
            await playerChooseNewSpell(spells)
        );
    }

    public getHtml() {
        return jsml.div({ class: 'entity player' }, [
            jsml.h3({ class: 'name' }, this.prefab.name),
            this.healthBar,
            this.spellPreview
        ]);
    }
}
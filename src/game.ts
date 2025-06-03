import { $, assert } from "../lib/std.ts";
import { prefab_none } from "./spells/None.ts";
import { prefab_rock } from "./spells/Rock.ts";
import { prefab_paper } from "./spells/Paper.ts";
import { prefab_scissors } from "./spells/Scissors.ts";
import Entity, { prefab_billy } from "./entities/Entity.ts";
import Player, { prefab_player, prefab_playerSpells } from "./entities/Player.ts";
import { showInfo } from "./core.ts";
import { GAME_EVENT_ROUND_END, GAME_EVENT_ROUND_START } from "./GameEvent.ts";



const viewport = assert($('.viewport'));



function pairsToMap(pairs: (string|number)[][]): Map<string, number> {
    const map = new Map();

    for (const pair of pairs) {
        const [spell, effectiveness] = pair;
        map.set(spell, effectiveness);
    }

    return map;
}

const spellMap: Map<string, Map<string, number>> = new Map();
spellMap.set(prefab_none.title, pairsToMap([
    [prefab_none.title, 0],
    [prefab_rock.title, -1],
    [prefab_paper.title, -1],
    [prefab_scissors.title, -1]
]));
spellMap.set(prefab_rock.title, pairsToMap([
    [prefab_none.title, 1],
    [prefab_rock.title, 0],
    [prefab_paper.title, -1],
    [prefab_scissors.title, 1]
]));
spellMap.set(prefab_paper.title, pairsToMap([
    [prefab_none.title, 1],
    [prefab_rock.title, 1],
    [prefab_paper.title, 0],
    [prefab_scissors.title, -1]
]));
spellMap.set(prefab_scissors.title, pairsToMap([
    [prefab_none.title, 1],
    [prefab_rock.title, -1],
    [prefab_paper.title, 1],
    [prefab_scissors.title, 0]
]));

const enemies = [new Entity(prefab_billy, prefab_playerSpells())];
const player = new Player(prefab_player, prefab_playerSpells());



async function startBattle(player: Entity, enemy: Entity): Promise<void> {
    viewport.textContent = "";
    viewport.append(enemy.getHtml());
    viewport.append(player.getHtml());

    const entities = [player, enemy];

    while (true) {
        if (!Entity.areAlive(entities)) {
            break;
        }

        await Promise.all([enemy.onEvent(GAME_EVENT_ROUND_START), player.onEvent(GAME_EVENT_ROUND_START)]);

        const enemySpell = enemy.onChooseSpell();
        const playerSpell = player.onChooseSpell();

        await Promise.all([enemySpell, playerSpell]);
        const es = await enemySpell;
        const ps = await playerSpell;

        if (!es.isAvailable()) {
            const msg = "Enemy chose invalid spell " + es.getName();
            alert(msg);
            throw new Error(msg);
        }

        if (!ps.isAvailable()) {
            const msg = "Player chose invalid spell " + ps.getName();
            alert(msg);
            throw new Error(msg);
        }

        const value = assert(assert(spellMap.get(ps.getName())).get(es.getName()));

        let roundResult = 'No one wins, nothing happens.';
        if (value > 0) {
            roundResult = player.getDefinition().name + ' wins the round.';
        }
        if (value < 0) {
            roundResult = enemy.getDefinition().name + ' wins the round.';
        }

        await showInfo([
            player.getDefinition().name + " used spell " + ps.getDefinition().title
            + " and " + enemy.getDefinition().name + " used spell " + es.getDefinition().title,
            roundResult
        ]);

        if (value > 0) {
            await ps.perform(player, enemy, es);
            if (!Entity.areAlive(entities)) {
                break;
            }
        }

        if (value < 0) {
            await es.perform(enemy, player, ps);
            if (!Entity.areAlive(entities)) {
                break;
            }
        }

        ps.use();
        es.use();

        await player.onEvent(GAME_EVENT_ROUND_END);
        if (!Entity.areAlive(entities)) {
            break;
        }

        await enemy.onEvent(GAME_EVENT_ROUND_END);
        if (!Entity.areAlive(entities)) {
            break;
        }

        if (player.getAvailableSpellCount() === 0) {
            await player.onDrawSpells(prefab_playerSpells());
            for (const spell of player.getSpells()) {
                spell.recharge();
            }
        }

        if (enemy.getAvailableSpellCount() === 0) {
            await enemy.onDrawSpells(prefab_playerSpells());
            for (const spell of enemy.getSpells()) {
                spell.recharge();
            }
        }
    }

    if (enemy.isAlive()) {
        await showInfo([enemy.getName() + ' wins']);
    }

    if (player.isAlive()) {
        await showInfo([player.getName() + ' wins']);
    }
}

startBattle(player, enemies[0]).then();

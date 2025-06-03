import { prefab_rock } from "./src/spell/Rock";
import { prefab_paper } from "./src/spell/Paper";
import { prefab_scissors } from "./src/spell/Scissors";
import { showInfo } from "./src/core";
import Player, { prefab_player, prefab_playerSpells } from "./src/entity/Player";
import Entity, { prefab_billy } from "./src/entity/Entity";
import { prefab_emptySpell } from "./src/spell/EmptySpell";



const viewport = $('.viewport');



function pairsToMap(pairs) {
    const map = new Map();

    for (const pair of pairs) {
        const [spell, effectiveness] = pair;
        map.set(spell, effectiveness);
    }

    return map;
}

/** @type {Map<string, Map<string, number>>} */
const spellMap = new Map();
spellMap.set(prefab_emptySpell.title, pairsToMap([
    [prefab_emptySpell.title, 0],
    [prefab_rock.title, -1],
    [prefab_paper.title, -1],
    [prefab_scissors.title, -1]
]));
spellMap.set(prefab_rock.title, pairsToMap([
    [prefab_emptySpell.title, 1],
    [prefab_rock.title, 0],
    [prefab_paper.title, -1],
    [prefab_scissors.title, 1]
]));
spellMap.set(prefab_paper.title, pairsToMap([
    [prefab_emptySpell.title, 1],
    [prefab_rock.title, 1],
    [prefab_paper.title, 0],
    [prefab_scissors.title, -1]
]));
spellMap.set(prefab_scissors.title, pairsToMap([
    [prefab_emptySpell.title, 1],
    [prefab_rock.title, -1],
    [prefab_paper.title, 1],
    [prefab_scissors.title, 0]
]));

const enemies = [new Entity(prefab_billy, prefab_playerSpells())];
const player = new Player(prefab_player, prefab_playerSpells());



/**
 * @param {Entity} player
 * @param {Entity} enemy
 * @returns {Promise<void>}
 */
async function startBattle(player, enemy) {
    viewport.textContent = "";
    viewport.append(enemy.getHtml());
    viewport.append(player.getHtml());

    const entities = [player, enemy];

    while (true) {
        if (!Entity.areAlive(entities)) {
            break;
        }

        enemy.newRound();
        player.newRound();

        const enemySpell = enemy.chooseSpell();
        const playerSpell = player.chooseSpell();
        
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

        const value = spellMap.get(ps.getName()).get(es.getName());

        let roundResult = 'No one wins, nothing happens.';
        if (value > 0) {
            roundResult = player.definition.name + ' wins the round.';
        }
        if (value < 0) {
            roundResult = enemy.definition.name + ' wins the round.';
        }

        await showInfo([
            player.definition.name + " used spell " + ps.definition.title
            + " and " + enemy.definition.name + " used spell " + es.definition.title,
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

        await player.endOfRound();
        if (!Entity.areAlive(entities)) {
            break;
        }

        await enemy.endOfRound();
        if (!Entity.areAlive(entities)) {
            break;
        }

        if (player.getAvailableSpellCount() === 0) {
            await player.addOneSpell(prefab_playerSpells());
            for (const spell of player.getSpells()) {
                spell.recharge();
            }
        }

        if (enemy.getAvailableSpellCount() === 0) {
            await enemy.addOneSpell(prefab_playerSpells());
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

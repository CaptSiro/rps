import { $, assert } from "../lib/std.ts";
import Entity, { prefab_billy } from "./entities/Entity.ts";
import Player, { prefab_player, prefab_playerSpells } from "./entities/Player.ts";
import { showInfo } from "./core.ts";
import { GAME_EVENT_ROUND_END, GAME_EVENT_ROUND_START } from "./GameEvent.ts";
import { DRAW, WIN } from "./spells/types/Type";



const viewport = assert($('.viewport'));

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

        const playerOutcome = ps.compare(es);
        const enemyOutcome = es.compare(ps);

        if (playerOutcome === DRAW && enemyOutcome === DRAW) {
            await showInfo(['No one wins, nothing happens.']);
        }

        if (playerOutcome === WIN) {
            await showInfo([player.getDefinition().name + ' wins the round.']);
            await ps.perform(player, enemy, es);
            if (!Entity.areAlive(entities)) {
                break;
            }
        }

        if (enemyOutcome === WIN) {
            await showInfo([enemy.getDefinition().name + ' wins the round.']);
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

import { $, assert } from "../lib/std.ts";
import Entity, { prefab_billy } from "./entities/Entity.ts";
import Player, { prefab_player, prefab_playerDeck, prefab_playerInitialSpells } from "./entities/Player.ts";
import { showInfo } from "./core.ts";
import { GAME_EVENT_ROUND_END, GAME_EVENT_ROUND_START } from "./GameEvent.ts";
import { DRAW, LOSS, WIN } from "./spells/class/SpellClass.ts";



const viewport = assert($('.viewport'));

const enemies = [new Entity(prefab_billy, prefab_playerInitialSpells(), prefab_playerDeck)];
const player = new Player(prefab_player, prefab_playerInitialSpells(), prefab_playerDeck);



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
            await showInfo([player.getPrefab().name + ' wins the round.']);
            await ps.perform(player, enemy, es);
            if (!Entity.areAlive(entities)) {
                break;
            }
        }

        if (enemyOutcome === WIN) {
            await showInfo([enemy.getPrefab().name + ' wins the round.']);
            await es.perform(enemy, player, ps);
            if (!Entity.areAlive(entities)) {
                break;
            }
        }

        if (playerOutcome !== LOSS) {
            ps.use();
        }

        if (enemyOutcome !== LOSS) {
            es.use();
        }

        await player.onEvent(GAME_EVENT_ROUND_END);
        if (!Entity.areAlive(entities)) {
            break;
        }

        await enemy.onEvent(GAME_EVENT_ROUND_END);
        if (!Entity.areAlive(entities)) {
            break;
        }

        if (player.getAvailableSpellCount() === 0) {
            await player.onDrawSpells(player.getDeck());
            for (const spell of player.getSpells()) {
                spell.recharge();
            }
        }

        if (enemy.getAvailableSpellCount() === 0) {
            await enemy.onDrawSpells(enemy.getDeck());
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

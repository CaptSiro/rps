import { $, assert } from "../lib/std.ts";
import Entity, { prefab_billy } from "./entities/Entity.ts";
import Player, { prefab_player, prefab_playerInitialSpells } from "./entities/Player.ts";
import Deck from "./Deck.ts";
import Slingshot, { prefab_slingshot } from "./spells/ranger/Slingshot.ts";
import { ConstantSequence } from "./sequences/ConstantSequence.ts";
import Tournament from "./Tournament.ts";
import FibonacciSequence from "./sequences/FibonacciSequence.ts";



async function main(): Promise<void> {
    const viewport = assert($('.viewport'));
    const tournamentContainer = assert($('.tournament'));

    const opponents = [
        new Entity(
            prefab_billy,
            prefab_playerInitialSpells(),
            Deck.fit(prefab_playerInitialSpells(), [new Slingshot(prefab_slingshot)], new ConstantSequence(0))
        ),
    ];

    const player = new Player(
        prefab_player,
        prefab_playerInitialSpells(),
        Deck.fit(prefab_playerInitialSpells(), [new Slingshot(prefab_slingshot)], new FibonacciSequence(2, 3))
    );

    const tournament = new Tournament(
        player,
        prefab_player.stats,
        0,
        opponents,
    );

    tournamentContainer.append(tournament.getBalanceHtml());

    while (!tournament.isCompleted()) {
        const battle = tournament.nextBattle();
        battle.setup(viewport);
        await battle.start();
    }
}

main().then();

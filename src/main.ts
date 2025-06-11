import { $, assert } from "../lib/std.ts";
import Entity, { prefab_billy } from "./entities/Entity.ts";
import Player, { prefab_player, prefab_playerDeck, prefab_playerInitialSpells } from "./entities/Player.ts";
import Opponent from "./Opponent.ts";
import Deck from "./Deck.ts";
import Slingshot, { prefab_slingshot } from "./spells/ranger/Slingshot.ts";
import { ConstantSequence } from "./sequences/ConstantSequence.ts";
import Tournament from "./Tournament.ts";
import FibonacciSequence from "./sequences/FibonacciSequence.ts";



async function main(): Promise<void> {
    const viewport = assert($('.viewport'));

    const opponents = [
        new Opponent(
            new Entity(prefab_billy, prefab_playerInitialSpells(), prefab_playerDeck),
            Deck.fit(prefab_playerInitialSpells(), [new Slingshot(prefab_slingshot)], new ConstantSequence(0))
        )
    ];

    const player = new Player(prefab_player, prefab_playerInitialSpells(), prefab_playerDeck);
    const tournament = new Tournament(
        player,
        prefab_player.stats,
        Deck.fit(prefab_playerInitialSpells(), [new Slingshot(prefab_slingshot)], new FibonacciSequence(2, 3)),
        0,
        opponents,
    );

    while (!tournament.isCompleted()) {
        const battle = tournament.nextBattle();
        battle.setup(viewport);
        await battle.start();
    }
}

main().then();

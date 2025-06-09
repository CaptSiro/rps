import { $, assert } from "../lib/std.ts";
import Entity, { prefab_billy } from "./entities/Entity.ts";
import Player, { prefab_player, prefab_playerDeck, prefab_playerInitialSpells } from "./entities/Player.ts";
import Battle from "./Battle.ts";



const viewport = assert($('.viewport'));

const enemies = [new Entity(prefab_billy, prefab_playerInitialSpells(), prefab_playerDeck)];
const player = new Player(prefab_player, prefab_playerInitialSpells(), prefab_playerDeck);

const battle = new Battle(enemies[0], player);
battle.setup(viewport);
battle.start().then();

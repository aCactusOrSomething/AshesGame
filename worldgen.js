/* ok so i need to
	-read and write a list of emojis to the database.
	-weights for land emojis.
*/

/*
the greatest sin: emoji
*/
const HISTORIES = [
	{ flavor: 'Cloning the President...', emoji: ['📄', '🖨️', '🗳️'], npcTypes: ['Lily Cypress'] }, // cactus
	{ flavor: 'ERROR: Florida corrupted. Flooding...', emoji: ['🌊', '🐊', '🏚️'], npcTypes: ['sailor', 'florida man'] }, // cactus
	{ flavor: 'Ohio recognized as sovreign nation.', emoji: ['🌰', '🏘️', '🧶'], npcTypes: ['citizen of Ohio'] }, // cactus
	{ flavor: 'WARNING: So many birds.', emoji: ['🦤', '🐦', '🦆', '🪶', '🥚'], npcTypes: ['talking bird'] }, // cactus
	{ flavor: 'Connection request from Grand Solar Archives. Authorizing...', emoji: ['📚', '🌞'], npcTypes: ['heliothecary'] }, // cactus
	{ flavor: 'INFO: Plant growth speed has been increased 1000%.', emoji: ['🌵', '🌸', '🌾', '🌴', '🎍', '🍂'], npcTypes: ['gardener', 'potted plant'] }, // cactus
	{ flavor: 'INFO: No antivirus was found in host universe.', emoji: ['💢', '👾', '??'], npcTypes: ['glitched being'] }, // cactus
	{ flavor: 'Please consider registering your copy of OmniFilm 2.', emoji: ['📷', '📹', '🎞️', '🎬'], npcTypes: ['extra'] }, // cactus
	{ flavor: 'Allocating swamps...', emoji: ['🐸', '🐛', '🪱'], npcTypes: ['ogre', 'muddy', 'stinky'] }, // kaz
	{ flavor: 'Increasing pollen levels...', emoji: ['🤧', '🍃', '🌷'], npcTypes: ['allergic', 'floral'] }, // kaz
	{ flavor: 'WARNING: History repeats itself.', emoji: ['🍷', '⚔️', '🏇', '🪄', '🎭', '💢', '🦯'], npcTypes: ['mage', 'historical figure'] }, // -grail war // neb
	{ flavor: 'Dragon containment breached.', emoji: ['🐉', '🐲'], npcTypes: ['great dragon', 'dragon hunter'] }, // -Dragons scorch an entire continent // neb
	{ flavor: 'Juggalo Administration restrictions present. rerouting...', emoji: ['🤡', '💬', '🥤'], npcTypes: ['honk secretary'] }, // -actual literal clown becomes President  // neb
	{ flavor: 'Atlantis Discovered.', emoji: ['🐟', '🔱', '🐠'], npcTypes: ['Atlantean', 'mermaid'] }, // -Atlantis surfaces as a world power // neb
	{ flavor: 'ERROR: Critical lack of pollinators.', emoji: ['🐝', '❌', '🥀', '💀'], npcTypes: ['ghastly bee', 'haunted flower'] }, // -bee extinction // neb
	{ flavor: 'Alpha! Recruit a team of teenagers with attitue!', emoji: ['🦖', '🦕', '🦸', '🤖', '🧙‍♀️', '🌁', '🌕'], npcTypes: ['power ranger', 'giant monster', 'evil moon witch'] }, // -power rangers // broon

	{ flavor: 'Defragmentation of Physical law required.', emoji: ['💍', '✌️', '🌳'], npcTypes: ['tarnished', 'Shardbearer'] }, // the shattering // egg
	{ flavor: 'Importing magpie.ash from /mars/...', emoji: ['♂️', '🦤', '🌳'], npcTypes: ['Martian', 'Magpie'] }, // the magpies have successfully unionized to destroy Mars // reddy
	{ flavor: 'WARNING: planetary temperatures exceeding maximum levels.', emoji: ['🌋', '⭕', '🌡️'], npcTypes: ['Heat Sink', 'Core Touched'] }, // Earth's OS became incompatible with the firmware of the Core, leading to major heat sink issues // shogun
	{ flavor: 'False stars detected.', emoji: ['⭐', '🌟', '🌠', '💫', '✨'], npcTypes: ['Star', '"Star"'] }, // -The lights beyond the solar system are not stars // shogun
	{ flavor: 'WARNING: Watch for falling space colonies!', emoji: ['🤖', '🛰️', '☄️', '🌌', '👨‍🚀️', '📡', '🌕'], npcTypes: ['mecha pilot', 'newtype'] }, // -gundam // broon
	{ flavor: 'Death has recruited her champions!', emoji: ['🐦', '⏪', '🪨', '🎨'], npcTypes: ['heir', 'businesswoman', 'sculptor'] }, // -medley // neb
	{ flavor: 'HENSHIN!', emoji: ['🦸', '🦹', '🐜️', '🏍️', '🐞', '🐛'], npcTypes: ['kamen rider'] }, // -kamen rider // broon
	{ flavor: 'Reconciling form and function...', emoji: ['🤖', '🛰️', '📡', '🏛️', '🖥️', '🛸 ', '📿', '🔄', '🛐'], npcTypes: ['mantle', 'elect', 'exalt', 'decrepit god-machine'] }, // -mantles // broon
	{ flavor: 'Randomly distributing magic...', emoji: ['🪄', '✨', '✴️'], npcTypes: ['magician', 'sage'] }, // -magic is suddenly very real which sucks // may
	{ flavor: 'Cutting the deck...', emoji: ['♣️', '♠️', '♥️', '♦️', '🃏'], npcTypes: ['jack', 'queen', 'king', 'ace', 'joker'] }, // -playing cards // broon
	{ flavor: 'Illuminating Dark gods...', emoji: ['🦑', '🐙'], npcTypes: ['UNKNOWN', 'cultist'] }, // 🦑-The Dark Gods have returned // neb
	{ flavor: 'ERROR: Unable to restore Internet.', emoji: ['💾', '🕸' ], npcTypes: ['Moderator'] }, // 🕸 - The Internet vanishes // neb
	{ flavor: 'C.O.V.E.N. Process Enabled.', emoji: ['🌪'], npcTypes: ['Witch', 'Wizard'] }, // 🌪-Witches appear and begin to wreck havoc // neb
	{ flavor: 'WARNING: Background radiation critical.', emoji: ['🐘', '👞', '☢️'], npcTypes: ['Elephant'] }, // -Elephant’s Foot brief exposure event // ollie
	{ flavor: 'Chat disabled during inauguration livestream.', emoji: ['☕' ], npcTypes: ['Senator985' ] }, // -the inauguration of the 69th president of the United States, Jeremy Elbertson // ollie
	{ flavor: 'Establishment Disestablished.', emoji: ['🅰️', '👽' ], npcTypes: ['anarchist'] }, // -Sudden Invasion of Earth by an Anarchical Cult // ollie
	{ flavor: 'Making sure it\'s not Monday…', emoji: ['🐱', '🐈', '🐈‍⬛'], npcTypes: ['cartoonist', 'lasagna eaters'] }, // -sunny

	// unimplemented, due to either lack of ideas or wanting to keep this SFW. you two are bastards and i love you both.
	// { flavor: 'Enabling jiggle physics…', emoji: ['🍈', '🎈'], npcTypes: ['onee-san', 'vrchat user'] }, // -hotted boobs up ahead // neb
	// -horny milfs leave all areas // neb
	// -Pluto really isn't a planet // shogun
	// -Saturn's Rings have disappeared // shogun

];

function shuffleArray(array) {
	let curId = array.length;
	// There remain elements to shuffle
	while (curId !== 0) {
		// Pick a remaining element
		const randId = Math.floor(Math.random() * curId);
		curId -= 1;
		// Swap it with the current element.
		const tmp = array[curId];
		array[curId] = array[randId];
		array[randId] = tmp;
	}
	return array;
}


class World {
	constructor(emojiPool, npcPool) {
		this.emojiPool = emojiPool;
		this.npcPool = npcPool;
	}

	makeLand(emojiPool = this.emojiPool) {
		const arr = shuffleArray(emojiPool);

		const myTraits = [arr[0], arr[1], arr[2]];

		return new Land(myTraits);
	}
}

class Land {
	constructor(traits) {
		this.traits = traits;
	}

	getDescription() {
		let ret = 'This land is ';
		ret += this.traits[0] + ', ' + this.traits[1] + ', and ' + this.traits[2];

		return ret;
	}
}

function worldGen() {
	let histories = shuffleArray(HISTORIES);
	histories = [histories[0], histories[1], histories[2]];

	const emoji = [];
	let npcPool = [];

	for (let i = 0; i < histories.length; i++) {
		const historyEmoji = histories[i].emoji;
		for (let j = 0; j < historyEmoji.length; j++) {
			emoji.push(historyEmoji[j]);
		}
		const historyNpcs = histories[i].npcTypes;
		for (let j = 0; j < historyNpcs.length; j++) {
			npcPool.push(historyNpcs[j]);
			npcPool = shuffleArray(npcPool);
		}
	}

	return {
		world: new World(emoji, npcPool),
		histories: histories,
	};

}

module.exports = {
	worldGen: worldGen,
	shuffleArray: shuffleArray,
	HISTORIES: HISTORIES,
	World: World,
	Land: Land,
};
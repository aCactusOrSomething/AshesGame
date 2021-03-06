/* ok so i need to
	-read and write a list of emojis to the database.
	-weights for land emojis.
*/

/*
the greatest sin: emoji
*/
const HISTORIES = [
	{ flavor: 'Cloning the President...', emoji: ['๐', '๐จ๏ธ', '๐ณ๏ธ'], npcTypes: ['Lily Cypress'] }, // cactus
	{ flavor: 'ERROR: Florida corrupted. Flooding...', emoji: ['๐', '๐', '๐๏ธ'], npcTypes: ['sailor', 'florida man'] }, // cactus
	{ flavor: 'Ohio recognized as sovreign nation.', emoji: ['๐ฐ', '๐๏ธ', '๐งถ'], npcTypes: ['citizen of Ohio'] }, // cactus
	{ flavor: 'WARNING: So many birds.', emoji: ['๐ฆค', '๐ฆ', '๐ฆ', '๐ชถ', '๐ฅ'], npcTypes: ['talking bird'] }, // cactus
	{ flavor: 'Connection request from Grand Solar Archives. Authorizing...', emoji: ['๐', '๐'], npcTypes: ['heliothecary'] }, // cactus
	{ flavor: 'INFO: Plant growth speed has been increased 1000%.', emoji: ['๐ต', '๐ธ', '๐พ', '๐ด', '๐', '๐'], npcTypes: ['gardener', 'potted plant'] }, // cactus
	{ flavor: 'INFO: No antivirus was found in host universe.', emoji: ['๐ข', '๐พ', '??'], npcTypes: ['glitched being'] }, // cactus
	{ flavor: 'Please consider registering your copy of OmniFilm 2.', emoji: ['๐ท', '๐น', '๐๏ธ', '๐ฌ'], npcTypes: ['extra'] }, // cactus
	{ flavor: 'Allocating swamps...', emoji: ['๐ธ', '๐', '๐ชฑ'], npcTypes: ['ogre', 'muddy', 'stinky'] }, // kaz
	{ flavor: 'Increasing pollen levels...', emoji: ['๐คง', '๐', '๐ท'], npcTypes: ['allergic', 'floral'] }, // kaz
	{ flavor: 'WARNING: History repeats itself.', emoji: ['๐ท', 'โ๏ธ', '๐', '๐ช', '๐ญ', '๐ข', '๐ฆฏ'], npcTypes: ['mage', 'historical figure'] }, // -grail war // neb
	{ flavor: 'Dragon containment breached.', emoji: ['๐', '๐ฒ'], npcTypes: ['great dragon', 'dragon hunter'] }, // -Dragons scorch an entire continent // neb
	{ flavor: 'Juggalo Administration restrictions present. rerouting...', emoji: ['๐คก', '๐ฌ', '๐ฅค'], npcTypes: ['honk secretary'] }, // -actual literal clown becomes President  // neb
	{ flavor: 'Atlantis Discovered.', emoji: ['๐', '๐ฑ', '๐?'], npcTypes: ['Atlantean', 'mermaid'] }, // -Atlantis surfaces as a world power // neb
	{ flavor: 'ERROR: Critical lack of pollinators.', emoji: ['๐', 'โ', '๐ฅ', '๐'], npcTypes: ['ghastly bee', 'haunted flower'] }, // -bee extinction // neb
	{ flavor: 'Alpha! Recruit a team of teenagers with attitue!', emoji: ['๐ฆ', '๐ฆ', '๐ฆธ', '๐ค', '๐งโโ๏ธ', '๐', '๐'], npcTypes: ['power ranger', 'giant monster', 'evil moon witch'] }, // -power rangers // broon

	{ flavor: 'Defragmentation of Physical law required.', emoji: ['๐', 'โ๏ธ', '๐ณ'], npcTypes: ['tarnished', 'Shardbearer'] }, // the shattering // egg
	{ flavor: 'Importing magpie.ash from /mars/...', emoji: ['โ๏ธ', '๐ฆค', '๐ณ'], npcTypes: ['Martian', 'Magpie'] }, // the magpies have successfully unionized to destroy Mars // reddy
	{ flavor: 'WARNING: planetary temperatures exceeding maximum levels.', emoji: ['๐', 'โญ', '๐ก๏ธ'], npcTypes: ['Heat Sink', 'Core Touched'] }, // Earth's OS became incompatible with the firmware of the Core, leading to major heat sink issues // shogun
	{ flavor: 'False stars detected.', emoji: ['โญ', '๐', '๐?', '๐ซ', 'โจ'], npcTypes: ['Star', '"Star"'] }, // -The lights beyond the solar system are not stars // shogun
	{ flavor: 'WARNING: Watch for falling space colonies!', emoji: ['๐ค', '๐ฐ๏ธ', 'โ๏ธ', '๐', '๐จโ๐๏ธ', '๐ก', '๐'], npcTypes: ['mecha pilot', 'newtype'] }, // -gundam // broon
	{ flavor: 'Death has recruited her champions!', emoji: ['๐ฆ', 'โช', '๐ชจ', '๐จ'], npcTypes: ['heir', 'businesswoman', 'sculptor'] }, // -medley // neb
	{ flavor: 'HENSHIN!', emoji: ['๐ฆธ', '๐ฆน', '๐๏ธ', '๐๏ธ', '๐', '๐'], npcTypes: ['kamen rider'] }, // -kamen rider // broon
	{ flavor: 'Reconciling form and function...', emoji: ['๐ค', '๐ฐ๏ธ', '๐ก', '๐๏ธ', '๐ฅ๏ธ', '๐ธ ', '๐ฟ', '๐', '๐'], npcTypes: ['mantle', 'elect', 'exalt', 'decrepit god-machine'] }, // -mantles // broon
	{ flavor: 'Randomly distributing magic...', emoji: ['๐ช', 'โจ', 'โด๏ธ'], npcTypes: ['magician', 'sage'] }, // -magic is suddenly very real which sucks // may
	{ flavor: 'Cutting the deck...', emoji: ['โฃ๏ธ', 'โ?๏ธ', 'โฅ๏ธ', 'โฆ๏ธ', '๐'], npcTypes: ['jack', 'queen', 'king', 'ace', 'joker'] }, // -playing cards // broon
	{ flavor: 'Illuminating Dark gods...', emoji: ['๐ฆ', '๐'], npcTypes: ['UNKNOWN', 'cultist'] }, // ๐ฆ-The Dark Gods have returned // neb
	{ flavor: 'ERROR: Unable to restore Internet.', emoji: ['๐พ', '๐ธ' ], npcTypes: ['Moderator'] }, // ๐ธ - The Internet vanishes // neb
	{ flavor: 'C.O.V.E.N. Process Enabled.', emoji: ['๐ช'], npcTypes: ['Witch', 'Wizard'] }, // ๐ช-Witches appear and begin to wreck havoc // neb
	{ flavor: 'WARNING: Background radiation critical.', emoji: ['๐', '๐', 'โข๏ธ'], npcTypes: ['Elephant'] }, // -Elephantโs Foot brief exposure event // ollie
	{ flavor: 'Chat disabled during inauguration livestream.', emoji: ['โ' ], npcTypes: ['Senator985' ] }, // -the inauguration of the 69th president of the United States, Jeremy Elbertson // ollie
	{ flavor: 'Establishment Disestablished.', emoji: ['๐ฐ๏ธ', '๐ฝ' ], npcTypes: ['anarchist'] }, // -Sudden Invasion of Earth by an Anarchical Cult // ollie
	{ flavor: 'Making sure it\'s not Mondayโฆ', emoji: ['๐ฑ', '๐', '๐โโฌ'], npcTypes: ['cartoonist', 'lasagna eaters'] }, // -sunny

	// unimplemented, due to either lack of ideas or wanting to keep this SFW. you two are bastards and i love you both.
	// { flavor: 'Enabling jiggle physicsโฆ', emoji: ['๐', '๐'], npcTypes: ['onee-san', 'vrchat user'] }, // -hotted boobs up ahead // neb
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
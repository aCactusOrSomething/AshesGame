const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3');

new sqlite3.Database('database.sqlite');

const sequelize = new Sequelize('db', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	dialectOptions: {
		charset: 'utf8mb4',
	},
	logging: false,
	// SQLite only
	// storage: 'database.sqlite',
});

function makeSession(id) {
	const players = sequelize.define(`${id}-Players`, { // PLAYER DATA
		userId: { // user ID
			type: Sequelize.STRING,
			unique: true,
		},
		name: { // character name
			type: Sequelize.STRING,
		},
		description: {
			type: Sequelize.TEXT,
		},
		naviganter: { type: Sequelize.STRING },
		time: { // are you using TIME?
			type: Sequelize.BOOLEAN,
		},
	});

	const world = sequelize.define(`${id}-Worlds`, { // WORLD DATA // TODO RENAME. GOD HOLY FUCK
		userId: { // user ID
			type: Sequelize.STRING,
			unique: true,
		},
		// todo make these into constants
		building: { type: Sequelize.STRING },
		size: { type: Sequelize.INTEGER },
		environment: { type: Sequelize.STRING },
		traits: { type: Sequelize.STRING },
	});

	const ships = sequelize.define(`${id}-Ships`, { // SHIP DATA
		userId: { // user ID
			type: Sequelize.STRING,
			unique: true,
		},
		capacity: { // how many characters are getting shoved on this vessel
			type: Sequelize.INTEGER,
		},
		fuel: {
			type: Sequelize.DOUBLE,
		},
		supplies: {
			type: Sequelize.DOUBLE,
		},
		structure: {
			type: Sequelize.DOUBLE,
		},
		passengers: {
			type: Sequelize.TEXT,
		},
	});

	const pools = sequelize.define(`${id}-Pools`, { // PROCEEDURAL DATA POOLS
		name: { // name of the pool.
			type: Sequelize.STRING,
			unique: true,
		},
		data: { type: Sequelize.STRING }, // all the data for them
	});

	return {
		players: players,
		world: world,
		ships: ships,
		pools: pools,
	};

}

async function syncSession(schemas, worldData, force = false) {
	await schemas.players.sync({ force: force });
	await schemas.world.sync({ force: force });
	await schemas.ships.sync({ force: force });
	await schemas.pools.sync({ force: force });
	await constructPools(schemas, worldData);
	return schemas;
}

async function constructPools(schemas, world) {
	try {
		const PoolsTable = schemas.pools;

		// EMOJI FROM HISTORY
		await PoolsTable.create({
			name: 'historyEmoji',
			data: world.emojiPool.join(),
		});

		// NPC NAMES
		await PoolsTable.create({
			name: 'npcNames',
			data: world.npcPool.join(),
		});

		// PROTOTYPING EMOJI
		await PoolsTable.create({
			name: 'prototypeEmoji',
			data: '',
		});

		return true;
	}
	catch (error) {
		console.log('FUCKED UP MAKING POOL TABLE SHIT');
		console.log(error);
		return false;
	}
}

async function getAllEmoji() {
	const ret = [];
	const EmojiTable = sequelize.model('emojis');

	let id = 1;
	do {
		const emoji = await EmojiTable.findOne({ where: { id: id } });
		ret.push(emoji.symbol);
		id++;
	} while (await EmojiTable.findOne({ where: { id: id } }));

	return ret;
}

module.exports = {
	sequelize: sequelize,
	makeSession: makeSession,
	syncSession: syncSession,
	constructPools: constructPools,
	getAllEmoji: getAllEmoji,
};
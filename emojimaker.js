const Sequelize = require('sequelize');
const { sequelize } = require('./datastuffs.js');

async function makeEmoji() {
	// define it first
	const Emoji = await sequelize.define('emojis', { // DATABASE ON EMOJI VALUES
		symbol: { // emoji symbol
			type: Sequelize.STRING,
		},
		fuel: { // emoji value as fuel.
			type: Sequelize.INTEGER,
		},
		structure: { // emoji value as a construction material.
			type: Sequelize.INTEGER,
		},
		lifesupport: { // emoji value as a life-sustaining object.
			type: Sequelize.INTEGER,
		},
		unsafe: { // is this emoji a living thing?
			type: Sequelize.BOOLEAN,
		},
		danger: { type: Sequelize.DOUBLE },
	});

	// now make one
	(Emoji.sync({ force: true })).then(() => {
		setTimeout(function() {
			addEmoji(Emoji);
		}, 5000);
	});


	return true;
}

module.exports = {
	makeEmoji: makeEmoji,
};

async function addEmoji(Emoji) {
	try {
		console.log('adding emoji!');
		await Emoji.create({ symbol: '😂', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🙂', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🙃', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😉', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😊', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😇', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🥰', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😍', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🤩', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😘', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😗', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '☺', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😚', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😙', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🥲', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😋', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😛', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😜', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🤪', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😝', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🤑', fuel: 3, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🤗', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🤭', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🤫', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🤔', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🤐', fuel: 0, structure: 1, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🤨', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😐', fuel: 0.1, structure: 0, lifesupport: 0, unsafe: false, danger: 0.1 });
		await Emoji.create({ symbol: '😑', fuel: 0.1, structure: 0, lifesupport: 0, unsafe: false, danger: 0.1 });
		await Emoji.create({ symbol: '😶', fuel: 0.1, structure: 0, lifesupport: 0, unsafe: false, danger: 0.1 });
		await Emoji.create({ symbol: '😶‍🌫️', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😏', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😒', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🙄', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😬', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😮‍💨', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🤥', fuel: 1, structure: 1, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😌', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😔', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😪', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🤤', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😴', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😷', fuel: 1, structure: 1, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🤒', fuel: 1, structure: 1, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🤕', fuel: 1, structure: 1, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🤢', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🤮', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🤧', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🥵', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🥶', fuel: 1, structure: 2, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🥴', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😵', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😵‍💫', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🤯', fuel: 3, structure: 0, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🤠', fuel: 1, structure: 2, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '🥳', fuel: 1, structure: 2, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🥸', fuel: 1, structure: 1, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😎', fuel: 1, structure: 1, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🤓', fuel: 1, structure: 1, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🧐', fuel: 1, structure: 1, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😕', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😟', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🙁', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '☹', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😮', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😯', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😲', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😳', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🥺', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😦', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😧', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😨', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😰', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '😥', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '😢', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '😭', fuel: 3, structure: 2, lifesupport: 0, unsafe: false, danger: 5 });
		await Emoji.create({ symbol: '😱', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😖', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😣', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😞', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😓', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '😩', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '😫', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🥱', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😤', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😡', fuel: 2, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '😠', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🤬', fuel: 3, structure: 0, lifesupport: 0, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '😈', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '👿', fuel: 2, structure: 1, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '💀', fuel: 0, structure: 2, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '☠', fuel: 0, structure: 3, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '💩', fuel: 2, structure: 1, lifesupport: 1, unsafe: false, danger: 5 });
		await Emoji.create({ symbol: '🤡', fuel: 1, structure: 1, lifesupport: 0, unsafe: true, danger: 3 });
		await Emoji.create({ symbol: '👹', fuel: 1, structure: 0, lifesupport: 0, unsafe: true, danger: 2 });
		await Emoji.create({ symbol: '🛌', fuel: 1, structure: 2, lifesupport: 1, unsafe: true, danger: 3 });
		await Emoji.create({ symbol: '🐵', fuel: 1, structure: 2, lifesupport: 1, unsafe: true, danger: 4 });
		await Emoji.create({ symbol: '🐒', fuel: 1, structure: 2, lifesupport: 1, unsafe: true, danger: 4 });
		await Emoji.create({ symbol: '🦍', fuel: 1, structure: 2, lifesupport: 1, unsafe: true, danger: 5 });
		await Emoji.create({ symbol: '🐺', fuel: 1, structure: 1, lifesupport: 1, unsafe: true, danger: 4 });
		await Emoji.create({ symbol: '🦊', fuel: 1, structure: 0, lifesupport: 1, unsafe: true, danger: 2 });
		await Emoji.create({ symbol: '🦝', fuel: 1, structure: 0, lifesupport: 1, unsafe: true, danger: 2 });
		await Emoji.create({ symbol: '🐱', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🐈', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🐈‍⬛', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🦃', fuel: 1, structure: 0, lifesupport: 2, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🐲', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '🐉', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '🐡', fuel: 1, structure: 0, lifesupport: 0, unsafe: false, danger: 1 });
		await Emoji.create({ symbol: '🐝', fuel: 1, structure: 2, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '🕸', fuel: 1, structure: 2, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🍑', fuel: 2, structure: 0, lifesupport: 2, unsafe: false, danger: 5 });
		await Emoji.create({ symbol: '🍆', fuel: 2, structure: 0, lifesupport: 2, unsafe: false, danger: 5 });
		await Emoji.create({ symbol: '🍼', fuel: 1, structure: 2, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '🥛', fuel: 1, structure: 2, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '☕', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🫖', fuel: 1, structure: 1, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🍵', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🍶', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🍾', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🍷', fuel: 2, structure: 1, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '🍸', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🍹', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🍺', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🍻', fuel: 2, structure: 1, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '🥂', fuel: 2, structure: 1, lifesupport: 1, unsafe: false, danger: 4 });
		await Emoji.create({ symbol: '🥃', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🥤', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🧋', fuel: 1, structure: 0, lifesupport: 1, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🧃', fuel: 1, structure: 1, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🧉', fuel: 2, structure: 0, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🧊', fuel: 0, structure: 2, lifesupport: 1, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🥢', fuel: 1, structure: 1, lifesupport: 0, unsafe: false, danger: 2 });
		await Emoji.create({ symbol: '🧱', fuel: 0, structure: 3, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🪨', fuel: 0, structure: 3, lifesupport: 0, unsafe: false, danger: 3 });
		await Emoji.create({ symbol: '🪵', fuel: 3, structure: 3, lifesupport: 0, unsafe: false, danger: 6 });
		await Emoji.create({ symbol: '🛖', fuel: 2, structure: 3, lifesupport: 0, unsafe: false, danger: 5 });
		console.log('i think im done!');
	}
	catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return console.log('That emoji already exists.');
		}
		return console.log(`Something went wrong with adding an emoji. ${error}`);
	}
}
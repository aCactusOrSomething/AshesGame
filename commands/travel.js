const { SlashCommandBuilder } = require('@discordjs/builders');
const { sequelize, toArray } = require('../datastuffs.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { makeEmbed, PURPLE, GREEN } = require('../templates.js');


const MAX_SELECT_MENU_SIZE = 25;

const DEBUG_ARRAY = [
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
	{ name: 'poop', traits:['💩', '📉', '😂'] },
];


module.exports = {
	data: new SlashCommandBuilder()
		.setName('travel')
		.setDescription('Go to another part of The World.'),
	async execute(interaction) {
		try {
			/*
			const WorldsTable = await sequelize.model(`${interaction.guildId}-Worlds`);
			console.log('worlds table found!');
			const WorldsArray = await toArray(WorldsTable);
			console.log('worlds array made!');
			const PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);
			*/
			try {
				// let components = [travelSelectMenu(WorldsArray, 0, PlayersTable)];
				let components = [travelSelectMenu(DEBUG_ARRAY, 0, PlayersTable)];

				if(DEBUG_ARRAY.length <)

				interaction.reply({ embeds: [makeEmbed('TKTK')], components: components});
			}
			catch {
				return interaction.reply({ embeds: [makeEmbed('ERROR: Unable to access data. Cactus messed up here.', GREEN)] });
			}
		}
		catch {
			return interaction.reply({ embeds: [makeEmbed('ERROR: Unable to access data. Is ASHES *Registered* for this server, and have you *Installed* it?', GREEN)] });
		}
	},
};

async function travelSelectMenu(worldsArray, page, playersTable) {
	const ret = new MessageActionRow();
	const menu = new MessageSelectMenu()
		.setCustomId('travel')
		.setPlaceholder('select a corner of The World to travel to.');
	for (let i = page * MAX_SELECT_MENU_SIZE; i < (page + 1) * MAX_SELECT_MENU_SIZE || i < worldsArray.length; i++) {
		const item = worldsArray[i];

		/*
		const user = await playersTable.findOne({ where: { userId: item.userId } });
		const name = await user.get('name');
		*/
		const name = item.name;
		menu.addOptions([
			{
				label: `${name}'s Realm`,
				description: `${item.traits[0]}, ${item.traits[1]}, and ${item.traits[2]}.`,
				value: `${item.userId}`,
			},
		]);
	}
	ret.addComponents(
		menu,
	);

	return ret;
}
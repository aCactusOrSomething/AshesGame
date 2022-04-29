const { SlashCommandBuilder } = require('@discordjs/builders');
const { sequelize } = require('../datastuffs.js');
const { MessageButton, MessageActionRow } = require('discord.js');
const { makeEmbed, GREEN, PURPLE } = require('../templates.js'); // use purple for normal exploration and green for combat interactions.

/*
	players go on a quest in their current area.
	A list of decisions theyll have to make pops up. you choose between 3 different things, and it doubles the emoji output.
*/

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scavenge')
		.setDescription('Explore your current location for resources.'),
	async execute(interaction) {
		await interaction.deferReply();

		try {
			// first i need all of these.
			const PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);
			const WorldsTable = await sequelize.model(`${interaction.guildId}-Worlds`);
			const EmojisTable = await sequelize.model('emojis');

			// next, i need to get data for the player, their location, and the emojis relevant to it.
			const playerData = await PlayersTable.findOne({ where: { userId: interaction.user.id } });
			const locationId = await playerData.get('location');
			const worldData = await WorldsTable.findOne({ where: { userId: locationId } });
			const worldEmojis = await worldData.get('traits').split(',');

			const emojiData = [];
			for (let i = 0; i < worldEmojis.length; i++) {
				const newEmoji = await EmojisTable.findOne({ where: { symbol: worldEmojis[i] } });
				emojiData.push(newEmoji);
			}

			// OK next step, i build 3 buttons for each emoji.
			const scavengeButtons = await scavengeButtonMenu(emojiData);
			const text = 'These are the available materials in this area. Please choose one to focus on for this expidition.\n\nMaterials with a higher DANGER increase your risk of interference from a third party.';
			await interaction.editReply({ embeds: [makeEmbed(text, PURPLE)], components: [scavengeButtons] });
		}
		catch (error) {
			await interaction.editReply({ embeds: [makeEmbed('ERROR: Unable to access data. Is ASHES *Registered* for this server, and have you *Installed* it?'), makeEmbed(error.toString())] });
		}

	},
};

async function scavengeButtonMenu(emojiData) {
	const ret = new MessageActionRow();
	for (let i = 0; i < emojiData.length; i++) {
		ret.addComponents(
			new MessageButton()
				.setCustomId(`${i}`)
				.setLabel(`Danger: ${await emojiData[i].get('danger')}`)
				.setEmoji(`${await emojiData[i].get('symbol')}`)
				.setStyle('PRIMARY'),
		);
	}
	return ret;
}
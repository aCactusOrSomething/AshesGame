const { SlashCommandBuilder } = require('@discordjs/builders');
const { sequelize, toArray } = require('../datastuffs.js');
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { makeEmbed, GREEN } = require('../templates.js');


const MAX_SELECT_MENU_SIZE = 25;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('travel')
		.setDescription('Go to another part of The World.'),
	async execute(interaction) {
		await interaction.deferReply();
		try {
			const WorldsTable = await sequelize.model(`${interaction.guildId}-Worlds`);
			const WorldsArray = await toArray(WorldsTable);
			const PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);
			try {
				let counter = 0;
				let select = await travelSelectMenu(WorldsArray, counter, PlayersTable);
				let content = [select];
				if (WorldsArray.length > MAX_SELECT_MENU_SIZE) {
					const buttons = await travelButtonMenu(WorldsArray, counter);
					content.push(buttons);
				}
				interaction.editReply({ embeds: [makeEmbed('TKTK')], components: content });

				const filter = i => i.user.id === interaction.user.id;

				const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

				collector.on('collect', async i => {
					let move = false;
					if (i.customId === 'back') {
						counter--;
						move = true;
					}
					else if (i.customId === 'next') {
						counter++;
						move = true;
					}

					if (move == true) {
						select = await travelSelectMenu(WorldsArray, counter, [] /* PlayersTable */);
						content = [select];
						if (WorldsArray.length > MAX_SELECT_MENU_SIZE) {
							const buttons = await travelButtonMenu(WorldsArray, counter);
							content.push(buttons);
						}
						await i.update({ embeds: [makeEmbed('TKTK')], components: content });
					}
					else {

						await PlayersTable.update({ location: i.customId }, { where: { userId: interaction.user.id } });
						await i.update({ embeds: [makeEmbed('TRAVEL SUCCESSFULL.\nTKTK')], components: [] });
					}
				},
				);
			}
			catch (error) {
				console.log(error);
				return interaction.editReply({ embeds: [makeEmbed('ERROR: Unable to access data. Cactus messed up here.', GREEN)] });
			}
		}
		catch (error) {
			console.log(error);
			return interaction.editReply({ embeds: [makeEmbed('ERROR: Unable to access data. Is ASHES *Registered* for this server, and have you *Installed* it?', GREEN)] });
		}
	},
};

async function travelButtonMenu(worldsArray, page) {
	const ret = new MessageActionRow();
	if (page > 0) {
		// previous page button
		ret.addComponents(
			new MessageButton()
				.setCustomId('back')
				.setLabel('previous page')
				.setStyle('PRIMARY'),
		);
	}

	// current page
	const maxPages = Math.ceil(worldsArray.length / (MAX_SELECT_MENU_SIZE));
	ret.addComponents(
		new MessageButton()
			.setCustomId('info')
			.setLabel(`${page + 1} of ${maxPages}`)
			.setStyle('SECONDARY')
			.setDisabled(true),
	);
	if ((1 + page) * MAX_SELECT_MENU_SIZE <= worldsArray.length) {
		// next page button
		ret.addComponents(
			new MessageButton()
				.setCustomId('next')
				.setLabel('next page')
				.setStyle('PRIMARY'),
		);
	}
	return ret;
}

async function travelSelectMenu(worldsArray, page, playersTable) {
	const ret = new MessageActionRow();
	const menu = new MessageSelectMenu()
		.setCustomId('travel')
		.setPlaceholder('select a corner of The World to travel to.');
	for (let i = page * MAX_SELECT_MENU_SIZE; i < (page + 1) * MAX_SELECT_MENU_SIZE && i < worldsArray.length; i++) {
		const item = worldsArray[i];


		const user = await playersTable.findOne({ where: { userId: item.userId } });
		const name = await user.get('name');
		menu.addOptions([
			{
				label: `${name}'s Realm`,
				description: `${item.traits}`,
				// TODO this needs to be cleaner.
				// description: `${item.traits[0]}, ${item.traits[1]}, and ${item.traits[2]}.`,
				value: `${item.userId}`,
			},
		]);
	}
	ret.addComponents(
		menu,
	);
	return ret;
}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { sequelize, tableToArray } = require('../datastuffs.js');
const { makeEmbed, RED } = require('../templates.js');

// TODO needs to delete the player.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('deleteplayer')
		.setDescription('PERMANENTLY DELETE USER DATA.'),

	async execute(interaction) {
		await interaction.deferReply();

		const registeredIDs = await sequelize.model('Guilds');
		if (await registeredIDs.findOne({ where: { guildId: interaction.guildId } }) == null) {
			return interaction.editReply({ embeds: [makeEmbed('Error: No records exist currently.', RED)], components: [] });
		}

		const PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);
		const WorldsTable = await sequelize.model(`${interaction.guildId}-Worlds`);
		const ShipsTable = await sequelize.model(`${interaction.guildId}-Ships`);
		// TODO need to check to see if the player exists before i delete them.

		try {
			const playerData = await PlayersTable.findOne({ where: { userId: interaction.user.id } });
			await playerData.get('name');
		}
		catch {
			await interaction.editReply({ embeds: [makeEmbed('Error: No records exist currently.', RED)], components: [] });
			return;
		}

		const text = makeEmbed('**WARNING**\n\nThis action will __permanently delete__ your player data.\n\nAre you sure?', RED);
		const buttons = new MessageActionRow();

		buttons.addComponents(
			new MessageButton()
				.setCustomId('delete')
				.setLabel('DELETE.')
				.setStyle('DANGER'),
			new MessageButton()
				.setCustomId('cancel')
				.setLabel('CANCEL.')
				.setStyle('SECONDARY'),
		);

		// deletion code
		const reply = await interaction.editReply({ embeds: [text], components: [buttons] });

		const collector = interaction.channel.createMessageComponentCollector({ time: 15000 }, { message: await reply });
		collector.on('collect', async i => {
			if (i.user.id !== interaction.user.id) {
				await i.reply({ content: 'These questions are not yours to answer.', ephemeral: true });
				return;
			}
			if (i.customId === 'delete') {

				await PlayersTable.destroy({
					where: { userId: `${interaction.user.id}` },
				});
				await WorldsTable.destroy({
					where: { userId: `${interaction.user.id}` },
				});
				await ShipsTable.destroy({
					where: { userId: `${interaction.user.id}` },
				});

				// i ALSO need to make sure they're removed from any arc they're the passenger of
				const ShipsArray = await tableToArray(ShipsTable);
				for (let j = 0; j < ShipsArray.length; j++) {
					const passengers = (await ShipsArray[j].get('passengers')).split(',');
					if (passengers[0] !== '') {
						passengers.splice(passengers.indexof(interaction.user.id), 1);
					}
				}
				await interaction.editReply({ embeds: [makeEmbed('DELETION PROCESSED.\n\n**RECORDS BURNED.**\n\n*Your character has been deleted successully. Thank you for playing!', RED)], components: [] });
				return;
			}

			await interaction.editReply({ embeds: [makeEmbed('DELETION CANCELLED.', RED)], components: [] });
		});
	},
};
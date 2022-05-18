const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
const { sequelize } = require('../datastuffs.js');
const { makeEmbed, RED } = require('../templates.js');

// TODO needs to delete the player.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('deleteserver')
		.setDescription('PERMANENTLY DELETE ALL SERVER DATA.'),

	async execute(interaction) {
		await interaction.deferReply();
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return interaction.editReply({ content: 'You must be the Server Administrator to use this command.', ephemeral: true });
		}

		const PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);
		const WorldsTable = await sequelize.model(`${interaction.guildId}-Worlds`);
		const PoolsTable = await sequelize.model(`${interaction.guildId}-Pools`);
		const ShipsTable = await sequelize.model(`${interaction.guildId}-Ships`);
		// TODO need to check to see if the player exists before i delete them.


		const registeredIDs = await sequelize.model('Guilds');
		if (await registeredIDs.findOne({ where: { guildId: interaction.guildId } }) == null) {
			return interaction.editReply({ embeds: [makeEmbed('Error: No records exist currently.', RED)], components: [] });
		}

		const text = makeEmbed('**WARNING**\n\nThis action will __permanently delete__ All data associated with this server.\n\nThis includes __All Player Data__ as well.\n\nAre you sure?', RED);
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

				await PlayersTable.sync({ force: true });
				await WorldsTable.sync({ force: true });
				await PoolsTable.sync({ force: true });
				await ShipsTable.sync({ force: true });
				await registeredIDs.destroy({
					where: { guildId: `${interaction.guildId}` },
				});
				await interaction.editReply({ embeds: [makeEmbed('DELETION PROCESSED.\n\n**RECORDS BURNED.**\n\n*Your world has been abandoned. Thank you for playing!', RED)], components: [] });
				return;
			}

			await interaction.editReply({ embeds: [makeEmbed('DELETION CANCELLED.', RED)], components: [] });
		});
	},
};
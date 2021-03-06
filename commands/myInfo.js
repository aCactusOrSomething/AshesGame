const { SlashCommandBuilder } = require('@discordjs/builders');
const { sequelize } = require('../datastuffs.js');
const { MessageEmbed } = require('discord.js');
const { makeEmbed, PURPLE, GREEN } = require('../templates.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('myinfo')
		.setDescription('A name and description of you.')
		.addStringOption(option => option.setName('name').setDescription('change your name.'))
		.addStringOption(option => option.setName('description').setDescription('change your description.')),
	async execute(interaction) {
		await interaction.deferReply();
		try {
			const newName = interaction.options.getString('name');
			const newDesc = interaction.options.getString('description');

			if (newName != null && newName.length > 256) throw new Error('name longer than 256 characters');
			try {
				const PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);

				try {
					const playerData = await PlayersTable.findOne({ where: { userId: interaction.user.id } });

					let name = await playerData.get('name');
					let desc = await playerData.get('description');
					let timeText = 'T.I.M.E. DISABLED';
					if (await playerData.get('fuel')) {
						timeText = 'T.I.M.E. ENABLED';
					}
					const text = `${desc}\n${timeText} \nFUEL: ${await playerData.get('fuel')} \nSTRUCTURE: ${await playerData.get('structure')} \nSUPPLIES: ${await playerData.get('supplies')} `;
					const emoji = await playerData.get('naviganter');

					if (newName != null) {
						await PlayersTable.update({ name: newName }, { where: { userId: interaction.user.id } });
						name = newName;
					}

					if (newDesc != null) {
						await PlayersTable.update({ description: newDesc }, { where: { userId: interaction.user.id } });
						desc = newDesc;
					}


					const embed = new MessageEmbed()
						.setColor(PURPLE)
						.setTitle(name)
						.setDescription(text)
						.setFooter(`${emoji} naviganter online...`);
					interaction.editReply({ embeds: [embed] });

				}
				catch {
					return interaction.editReply({ embeds: [makeEmbed('ERROR: unable to access data from the future. \n*Please `/ install` A.S.H.E.S. to gain access.*', GREEN)] });
				}

			}
			catch {
				return interaction.editReply({ embeds: [makeEmbed('ERROR: Unable to access data. Is ASHES *Registered* for this server, and have you *Installed* it?', GREEN)] });
			}
		}
		catch {
			return interaction.editReply({ embeds: [makeEmbed('ERROR: Name must be less than 256 characters.', GREEN)] });
		}
	},
};

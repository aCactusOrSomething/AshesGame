const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Permissions } = require('discord.js');
const { sequelize, makeSession, syncSession } = require('../datastuffs.js');
const { makeEmbed, PURPLE, GREEN } = require('../templates.js');
const { worldGen } = require('../worldgen.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('registerserver')
		.setDescription('Initialize A.S.H.E.S. for this reality. Start a New Game in this server.'),
	async execute(interaction) {
		await interaction.deferReply();
		try {
			if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				return interaction.editReply({ content:'You must be the Server Administrator to use this command.', ephemeral: true });
			}
			const confirmationText = '**A.S.H.E.S. is an apocalypse evacuation protocol. Do not introduce it to this reality unless it is already doomed.\n\nDo you still wish to continue?**';
			const color = PURPLE;
			const registeredIDs = await sequelize.model('Guilds');
			if (await registeredIDs.findOne({ where: { guildId: interaction.guildId } }) != null) {
				return interaction.editReply({ content:'This server has already been initialized. You must `/deleteserver` first before registering as a new world.', ephemeral: true });
			}

			const schemas = makeSession(interaction.guildId);
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('yes')
						.setLabel('YES')
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('no')
						.setLabel('NO')
						.setStyle('SECONDARY'),
				);
			const embed = makeEmbed(confirmationText, color);

			const reply = await interaction.editReply({ embeds: [embed], components: [row] });
			const collector = interaction.channel.createMessageComponentCollector({ time: 15000 }, { message: await reply });

			collector.on('collect', async i => {
				if (i.customId === 'yes') {
					const worldData = worldGen();

					let loadingHints = '';
					for (let j = 0; j < worldData.histories.length; j++) {
						loadingHints += worldData.histories[j].flavor + '\n';
					}

					const nEmbed = makeEmbed(`**ASHES TO ASHES
DUST TO DUST
FAN THE FIRE, EMBRACE THE FLAMES**\
\`\`\`
${loadingHints}
INITIALIZING APOCALYPSE SAFE HAVEN EVACUATION SYSTEM (A.S.H.E.S.)\`\`\` 
							
*Program initialized. please have each user /installplayer to continue...*`, GREEN);
					await i.update({ embeds: [nEmbed], components: [] });
					const myWorld = worldData.world;
					await syncSession(schemas, myWorld, true, true);

					const GuildsTable = await sequelize.model('Guilds');
					GuildsTable.create({ guildId: interaction.guildId });
				}
				else if (i.customId === 'no') {
					const nEmbed = makeEmbed('***ABORTED.***');
					return await i.update({ embeds: [nEmbed], components: [] });
				}
			});

			return;


		}
		catch (error) {
			return interaction.editReply(`Something went wrong. ${error}`);
		}
	},
};
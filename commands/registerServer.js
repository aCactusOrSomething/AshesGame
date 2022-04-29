const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { sequelize, makeSession, syncSession } = require('../datastuffs.js');
const { makeEmbed, RED, PURPLE, GREEN } = require('../templates.js');
const { worldGen } = require('../worldgen.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('registerserver')
		.setDescription('Initialize A.S.H.E.S. for this reality. Start a New Game in this server.'),
	async execute(interaction) {
		await interaction.deferReply();
		try {

			let confirmationText = '**A.S.H.E.S. is an apocalypse evacuation protocol. Do not introduce it to this reality unless it is already doomed.\n\nDo you still wish to continue?**';
			let color = PURPLE;
			if (sequelize.isDefined(`${interaction.guildId}-Players`)) {
				confirmationText = '**__This will reset A.S.H.E.S.__\n\n All data for this server will be __DELETED__, and replaced with a clean slate. \n\nAre you sure you want to do this?**';
				color = RED;
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


			const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

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

			return interaction.editReply({ embeds: [embed], components: [row] });


		}
		catch (error) {
			return interaction.editReply(`Something went wrong. ${error}`);
		}
	},
};
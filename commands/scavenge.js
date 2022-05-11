const { SlashCommandBuilder } = require('@discordjs/builders');
const { sequelize } = require('../datastuffs.js');
const { MessageButton, MessageActionRow } = require('discord.js');
const { makeEmbed, PURPLE } = require('../templates.js'); // use purple for normal exploration and green for combat interactions.\

const PAYOUT_NUMBER = 10;
//

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
			const scavengeButtons = await scavengeButtonMenu(emojiData, worldEmojis);
			const text = 'These are the available materials in this area. Please choose one to focus on for this expidition.\n\nMaterials with a higher DANGER increase your risk of interference from a third party.';
			const reply = await interaction.editReply({ embeds: [makeEmbed(text, PURPLE)], components: [scavengeButtons] });

			// now i need to collect those.
			const collector = reply.createMessageComponentCollector({ time: 15000 });
			collector.on('collect', async i => {
				if (i.user.id !== interaction.user.id) {
					await i.reply({ content: 'These questions are not yours to answer.', ephemeral: true });
					return;
				}

				const chosenEmoji = emojiData[i.customId];
				let newFuel = 0;
				let newSupplies = 0;
				let newStructure = 0;

				let interruptionText = '';
				const randWeight = Math.random() * 100;
				if ((chosenEmoji == null && randWeight <= 3) || (chosenEmoji != null && randWeight <= await chosenEmoji.get('danger'))) {
					// TODO this is where you put the NPC interruption code, i think.
					interruptionText = 'you would have met an NPC here, but i havent written that code yet.';
				}

				let scavengingString = '';

				for (let j = 0; j < PAYOUT_NUMBER; j++) {
					const rand = Math.random() * emojiData.length;

					let found = chosenEmoji;
					let temp = i.customId;
					for (let k = 0; k < emojiData.length; k++) {
						if (rand < k + 1) {
							temp = k;
							k = emojiData.length + 5;
						}
					}
					found = emojiData[temp];


					if (found != null) {
						scavengingString = scavengingString + await found.get('symbol');

						newFuel += await found.get('fuel');
						newSupplies += await found.get('lifesupport');
						newStructure += await found.get('structure');
					}
					else {
						scavengingString = scavengingString + worldEmojis[temp];

						newFuel += 1;
						newSupplies += 1;
						newStructure += 1;
					}
				}

				await PlayersTable.update({
					fuel: await playerData.get('fuel') + newFuel,
					structure: await playerData.get('structure') + newStructure,
					supplies: await playerData.get('supplies') + newSupplies,
				}, { where: { userId: interaction.user.id } });
				await i.update({ embeds: [makeEmbed(`Scavenging successful.\n__RAW SALVAGE__:\n${scavengingString}\n\n__CONVERTED RESULTS:__\nFuel: ${newFuel}\nStructure: ${newStructure}\nSupplies: ${newSupplies}\n${interruptionText}`)], components: [] });
			});
		}
		catch (error) {
			await interaction.editReply({ embeds: [makeEmbed('ERROR: Unable to access data. Is ASHES *Registered* for this server, and have you *Installed* it?'), makeEmbed(error.toString())] });
		}

	},
};

async function scavengeButtonMenu(emojiData, worldEmojis) {
	const ret = new MessageActionRow();
	for (let i = 0; i < emojiData.length; i++) {
		if (emojiData[i] != null) {
			ret.addComponents(
				new MessageButton()
					.setCustomId(`${i}`)
					.setLabel(`Danger: ${await emojiData[i].get('danger')}`)
					.setEmoji(`${await emojiData[i].get('symbol')}`)
					.setStyle('PRIMARY'),
			);
		}
		else {
			ret.addComponents(
				new MessageButton()
					.setCustomId(`${i}`)
					.setLabel(`Danger: ${3}`)
					.setEmoji(`${worldEmojis[i]}`)
					.setStyle('PRIMARY'),
			);
		}
	}
	return ret;
}
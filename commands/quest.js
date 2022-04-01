const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quest')
		.setDescription('Go Searching For Materials!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};

/* OUTLINE

*/
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { sequelize, setup } = require('./datastuffs.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	setup();
	try {
		sequelize.authenticate();
		client.user.setActivity('v0.1.0 - Survival & Escape', { type: 'PLAYING' });
		console.log('database connection achieved!');
	}
	catch (error) {
		console.log('unable to connect to database', error);
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.guild == null) return interaction.reply({ content: 'A.S.H.E.S. Cannot execute commands from a DM. Try using this within a server.', ephemeral: true });

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);

const { defineEmoji } = require('./emojimaker.js');
defineEmoji();

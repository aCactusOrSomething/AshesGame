/* JOIN AN EXISTING GAME OF ASHES.
1. check to see if the server is registered.
2. create a thread.
3. ask survey questions in the tread. let players choose their name, where they live, what they "prototype etc
4. once they're all answered, present a confirmation message.
*/

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { sequelize, getAllEmoji } = require('../datastuffs.js');
const { makeEmbed, RED } = require('../templates.js');
const { World, shuffleArray } = require('../worldgen.js');
// const { sequelize, DISCLAIMER, makeSession, sync } = require('../datastuffs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('installplayer')
		.setDescription('Submit yourself to the A.S.H.E.S. Join the game as a Player.'),
	async execute(interaction) {

		let PlayersTable;
		try {
			PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);
		}
		catch {
			return interaction.reply({ embeds: [makeEmbed('ERROR: A.S.H.E.S. has not been initialized in this reality. \n*Please `/register` A.S.H.E.S, and then `/install` it in your dwelling.*')] });
		}

		let embed = makeEmbed(`This wizard will guide the installation of A.S.H.E.S.

It is recommended that you turn off all other appliances before starting the setup. This will make it possible to update relevant system structures without having to reboot your dwelling.

Please open the Installation Wizard Thread below to continue.`);

		if ((await PlayersTable.findOne({ where: { userId: interaction.user.id } }))) {
			embed = makeEmbed(`***WARNING***: A.S.H.E.S. already registered.
Completing this wizard will __WIPE ALL YOUR PREVIOUS CHARACTER DATA.__
If you do not wish to do this, you may safely ignore this thread.`, RED);
		}


		const d = new Date();
		const time = d.getTime();
		let thread = null;
		if (!interaction.channel.isThread()) {
			await interaction.reply({ embeds: [embed] });
			thread = await interaction.channel.threads.create({
				name: `install-wizard-${time}`,
				autoArchiveDuration: 60,
				reason: 'Adding user',
			});
			await thread.members.add(interaction.user.id);
		}
		else {
			await interaction.reply({ embeds: [makeEmbed('**ERROR.** Unable to create installation wizard thread.\n*this application will now close.*')] });
			return false;
		}


		const newPlayerData = {
			name: 'Lily Cypress',
			description: 'A new A.S.H.E.S. player.',
			id: interaction.user.id,
			location: 'House',
			size: 'Small',
			environment: 'Urban',
			naviganter: '❓',
			landTraits: '❓,❔,⁉️',
			time: false,

		};
		const messageOne = await thread.send(questionOne());
		const updateOne = messageOne.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 600000 });
		const confOne = messageOne.createMessageComponentCollector({ componentType: 'BUTTON', time: 600000 });

		updateOne.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				newPlayerData[i.customId] = i.values[0];
				await i.update(questionOne(newPlayerData.location, newPlayerData.size, newPlayerData.environment));
			}
			else {
				i.reply({ content: 'These questions are not yours to answer.', ephemeral: true });
			}
		});

		confOne.on('collect', async i => {
			if (i.user.id === interaction.user.id) {
				const messageTwo = await i.reply(await questionTwo());

				const confTwo = messageTwo.createMessageComponentCollector({ componentType: 'BUTTON', time: 600000 });

				confTwo.on('collect', async j => {
					if (j.user.id === interaction.user.id) {
						newPlayerData.naviganter = j.customId;

						const messageThree = await j.reply(questionThree());

						const confThree = await messageThree.createMessageComponentCollector({ componentType: 'BUTTON', time: 600000 });

						confThree.on('collect', async k => {
							if (k.user.id === interaction.user.id) {
								if (k.customId == 'time') newPlayerData.time = true;
								const reply = await addThePlayer(k, newPlayerData);
								k.reply(reply);
							}
							else {
								k.reply({ content: 'These questions are not yours to answer.', ephemeral: true });
							}
						});
					}
					else {
						j.reply({ content: 'These questions are not yours to answer.', ephemeral: true });
					}
				});
			}
			else {
				i.reply({ content: 'These questions are not yours to answer.', ephemeral: true });
			}
		});

	},
};

function nextButton() {
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('yes')
				.setLabel('NEXT')
				.setStyle('PRIMARY'),
		);
	return row;

}

function questionOne(location = 'A House', size = 'Small', environment = 'Urban') {
	const row1 = q1r1(location);
	const row2 = q1r2(size);
	const row3 = q1r3(environment);
	const embed = makeEmbed(`**THE MATCH IS STRUCK.**

Please describe your installation location, and then click Next to continue.
	`);

	return { embeds: [embed], components: [row1, row2, row3, nextButton()] };
}

function q1r1(placeholder = 'A House') {
	return new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('location')
				.setPlaceholder(placeholder)
				.addOptions([
					{
						label: 'A House',
						value: 'House',
					},
					{
						label: 'An Apartment',
						value: 'Apartment',
					},
					{
						label: 'An Office',
						value: 'Office',
					},
					{
						label: 'Outdoors',
						value: 'Outdoors',
					},
					{
						label: 'A Vehicle',
						value: 'Vehicle',
					},
				]),
		);
}

function q1r2(placeholder = 'Small') {
	return new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('size')
				.setPlaceholder(placeholder)
				.addOptions([
					{
						label: 'Small',
						value: 'Small',
					},
					{
						label: 'Medium',
						value: 'Medium',
					},
					{
						label: 'Large',
						value: 'Large',
					},
				]),
		);
}

function q1r3(placeholder = 'Urban') {
	return new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('environment')
				.setPlaceholder(placeholder)
				.addOptions([
					{
						label: 'Urban',
						value: 'Urban',
					},
					{
						label: 'Suburban',
						value: 'Suburban',
					},
					{
						label: 'Plain',
						value: 'Plain',
					},
					{
						label: 'Forest',
						value: 'Forest',
					},
					{
						label: 'Water',
						value: 'Water',
					},
					{
						label: 'Sky',
						value: 'Sky',
					},
					{
						label: 'Cold',
						value: 'Cold',
					},
					{
						label: 'Warm',
						value: 'Warm',
					},
					{
						label: 'Angry',
						value: 'Angry',
					},
				]),
		);
}

async function questionTwo() {
	console.log('making 2nd question...');
	const embed = makeEmbed(`**A WISP OF SMOKE EMERGES.**
	
Next, you will chose a seed for your *Naviganter*. The Naviganter will serve as a guide in A.S.H.E.S., and is a key component in the endgame construction of an *Arc*.
Naviganter seeds are represented via Emojis. We have gathered a random selection of potential seeds for you to choose from.

**WARNING:** A.S.H.E.S. recommends against employing any already sentient being with your naviganter.

__Please select the seed you wish to use.__`);

	let emojis = await getAllEmoji();
	emojis = shuffleArray(emojis);
	console.log(emojis);
	const rows = [];

	const EmojisTable = await sequelize.model('emojis');


	for (let i = 0; i < 5; i++) {
		const buttons = [];
		for (let j = 0; j < 5; j++) {
			const myEmoji = emojis[i * 5 + j];

			let style = 'SECONDARY';
			try {
				const emojiData = await EmojisTable.findOne({ where: { symbol: myEmoji } });
				const unsafe = await emojiData.get('unsafe');
				if (unsafe) {
					style = 'DANGER';
				}
			}
			catch {
				console.log('error');
			}

			const button = new MessageButton()
				.setCustomId(myEmoji)
				.setEmoji(myEmoji)
				.setStyle(style);
			buttons.push(button);
		}

		const row = new MessageActionRow().addComponents(
			buttons[0], buttons[1], buttons[2], buttons[3], buttons[4],
		);
		rows.push(row);
	}
	console.log('finished making buttons!');
	return { embeds: [embed], components: rows, fetchReply: true };
}

function questionThree() {
	const embed = makeEmbed(`**THE ORANGE GLOW RISES.**

You may opt to install the Temporal Interaction Management Environment (**T.I.M.E.**), which allows manipulation of the cubic timelines surrounding your ASHES instance.

While this is a powerful tool, it is not compatible with The ARC Construction Package.
__YOU WILL NOT BE ABLE TO LEAVE ON YOUR OWN__, and will have to hitch a ride.

You can opt into this at any time with /time, but __YOU CANNOT GO BACK ONCE YOU DO.__`);

	const button = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('arc')
				.setLabel('Use Reccommended settings.')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('time')
				.setLabel('Use T.I.M.E.')
				.setStyle('DANGER'),
		);
	return { embeds: [embed], components: [button], fetchReply: true };
}

async function addThePlayer(interaction, playerData) {
	try {
		const PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);
		const WorldsTable = await sequelize.model(`${interaction.guildId}-Worlds`);
		const PoolsTable = await sequelize.model(`${interaction.guildId}-Pools`);

		await PlayersTable.create({
			userId: playerData.id,
			name: playerData.name,
			description: playerData.description,
			naviganter: playerData.naviganter,
			time: playerData.time,
		});

		// TODO this is where world gen data goes!
		let historyEmoji = await PoolsTable.findOne({ where: { name: 'historyEmoji' } });
		historyEmoji = await historyEmoji.get('data');
		historyEmoji = historyEmoji.split(',');
		console.log(historyEmoji);
		const world = new World(historyEmoji, []);

		let land = null;
		if (playerData.time) {
			land = world.makeLand();
		}
		else {
			land = world.makeLand(await getAllEmoji());
		}
		playerData.landTraits = land.traits.join();

		await WorldsTable.create({
			userId: playerData.id,
			building: playerData.location,
			size: playerData.size,
			environment: playerData.environment,
			traits: playerData.landTraits,
		});

		const embed = makeEmbed(
			`**THE FLAMES CONSUME.**\n\n**THE FLAMES CONSUME ALL.**\n\nThank you for installing the Apocalypse Safe Haven Evacuation Protocol (*A.S.H.E.S.*). You will awaken at The End Of The World.\n\n*your abode emerges in a land full of: ${land.traits[0]}, ${land.traits[1]}, and ${land.traits[2]}.\n\n*You may now use \`/myinfo\` to write a name and description for yourself.*`);

		return { embeds: [embed], fetchReply: true };
	}
	catch (error) {
		console.log(error);
		return { embeds: [makeEmbed('**ERROR.** unable to send character to database. If you pressed a button twice, it\'s probably already in there.*')] };
	}
}
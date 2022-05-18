const { SlashCommandBuilder } = require('@discordjs/builders');
const { sequelize, tableToArray } = require('../datastuffs.js');
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { makeEmbed, GREEN } = require('../templates.js');


const MAX_SELECT_MENU_SIZE = 25;

const COLLECT_STATES = {
	NONE: 0,
	MOVE: 1,
	BUILD: 2,
	SELECT: 3,
	DONATE: 4,
	BOARD: 5,
	LAUNCH: 6,
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('arc')
		.setDescription('Prepare to leave this world.'),
	async execute(interaction) {
		await interaction.deferReply();
		try {
			const ShipsTable = await sequelize.model(`${interaction.guildId}-Ships`);
			const ShipsArray = await tableToArray(ShipsTable);
			const PlayersTable = await sequelize.model(`${interaction.guildId}-Players`);

			const userData = await PlayersTable.findOne({ where: { userId: interaction.user.id } });
			await userData.get('id');
			let alreadyBoarded = false;
			let chosenShipId;


			let chosenShip;

			// get the list of passengers
			let passengers;
			try {
				let counter = 0;
				let content = [];
				let select = null;
				if (ShipsArray.length > 0) {
					select = await arcSelectMenu(ShipsArray, counter, PlayersTable);
					content = [select];
					if (ShipsArray.length > MAX_SELECT_MENU_SIZE) {
						const buttons = await arcButtonPager(ShipsArray, counter);
						content.push(buttons);
					}
				}

				// this section is added if you are allowed to build spaceships.
				// I.E. you have not built one already, and you do not have TIME enabled.
				let canBuild = false;
				try {
					const myShip = await ShipsTable.findOne({ where: { userId: interaction.user.id } });
					await myShip.get('id');
				}
				catch {
					if (await userData.get('time') != 1) {
						canBuild = true;
					}
				}

				if (canBuild) {
					const buildingButtonRow = new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId('new')
							.setLabel('CONSTRUCT NEW ARC')
							.setStyle('SUCCESS'),
					);
					content.push(buildingButtonRow);
				}


				const reply = await interaction.editReply({ embeds: [makeEmbed('TKTK')], components: content });

				const collector = interaction.channel.createMessageComponentCollector({ time: 15000 }, { message: await reply });

				collector.on('collect', async i => {
					if (i.user.id !== interaction.user.id) {
						await i.reply({ content: 'These questions are not yours to answer.', ephemeral: true });
						return;
					}

					// STATE DECIDING HERE :)
					let state = COLLECT_STATES.SELECT;
					if (i.customId === 'back') {
						counter--;
						state = COLLECT_STATES.MOVE;
					}
					else if (i.customId === 'next') {
						counter++;
						state = COLLECT_STATES.MOVE;
					}
					else if (i.customId === 'new') {
						state = COLLECT_STATES.BUILD;
					}
					else if (i.customId === 'addMaterials') {
						state = COLLECT_STATES.DONATE;
					}
					else if (i.customId === 'board') {
						state = COLLECT_STATES.BOARD;
					}
					else if (i.customId === 'launch') {
						state = COLLECT_STATES.LAUNCH;
					}


					// ANNNND HANDLING THE STATES HERE
					if (state == COLLECT_STATES.MOVE) {
						select = await arcSelectMenu(ShipsArray, counter, [] /* PlayersTable */);
						content = [select];
						if (ShipsArray.length > MAX_SELECT_MENU_SIZE) {
							const buttons = await arcButtonPager(ShipsArray, counter);
							content.push(buttons);
						}
						await i.update({
							embeds: [makeEmbed('**ARC SELECTION**\nSelect an arc from the list below.')], components: content,
						});
					}
					else if (state == COLLECT_STATES.BUILD) {
						await ShipsTable.create({
							userId: interaction.user.id,
							capacity: 0,
							fuel: 0,
							supplies: 0,
							structure: 0,
							passengers: `${interaction.user.id}`,
						});
						await i.update({
							embeds: [makeEmbed('**FOUNDATION LAIN.**\nYour new Arc is accessible on future uses of this command.')], components: [],
						});
					}
					else if (state == COLLECT_STATES.BOARD) {
						passengers.push(i.user.id);
						await ShipsTable.update({ passengers: passengers.toString() }, { where: { userId: chosenShipId } });
						await i.update({ embeds: [makeEmbed('You have boarded this vessel.')], components: [] });
					}
					else if (state == COLLECT_STATES.DONATE) {
						// add all your materials to the ship
						// then delete the materials you have
						// then post an update message <3
						await ShipsTable.update({
							fuel: await chosenShip.get('fuel') + await userData.get('fuel'),
							supplies: await chosenShip.get('supplies') + await userData.get('supplies'),
							structure: await chosenShip.get('structure') + await userData.get('structure'),
						}, { where: { userId: chosenShipId } });
						await PlayersTable.update({
							fuel: 0,
							supplies: 0,
							structure: 0,
						}, { where: { userId: await userData.get('userId') } });

						await i.update({ embeds: [makeEmbed('Materials Donated.')], components: [] });
					}
					else if (state == COLLECT_STATES.LAUNCH) {
						// TODO :)
						await i.update({ embeds: [makeEmbed('You have escaped the world.\n\nThanks for playing.')], components: [] });
					}
					else if (state == COLLECT_STATES.SELECT) {
						/*	TODO
							-when ship is selected:
								A: request permission to board ship.
								B: submit all available materials to the ship.
							C: (if creator) launch ship when ready.
						*/
						console.log(i.values[0]);
						// need to get the chosen ship first
						chosenShipId = i.values[0];
						chosenShip = await ShipsTable.findOne({ where: { userId: i.values[0] } });

						// get the list of passengers
						passengers = (await chosenShip.get('passengers').split(','));
						if (passengers[0] === '') {
							passengers = [];
						}
						let passengersString = '';
						const passengersRefs = [];
						for (let k = 0; k < passengers.length; k++) {
							passengersRefs[k] = await PlayersTable.findOne({ where: { userId: passengers[k] } });
							if (passengersRefs[k] != null) {
								passengersString += `\n${await passengersRefs[k].get('name')}`;
							}
							if (passengers[k] == i.user.id) {
								alreadyBoarded = true;
							}
						}


						// calculate capacity
						const fuel = await chosenShip.get('fuel');
						const supplies = await chosenShip.get('supplies');
						const structure = await chosenShip.get('structure');
						const arcInfo = getShipInfo(fuel, supplies, structure);

						const enableLaunch = arcInfo.finalPassengers <= passengers.length && chosenShipId == i.user.id;
						console.log(enableLaunch);

						const infoText = `${await (await PlayersTable.findOne({ where: { userId: i.values[0] } })).get('name')}'s ARC

FUEL: ${fuel}  |  Capacity: ${arcInfo.fuelPassengers} Passengers,  ${arcInfo.nextFuelCap - fuel} fuel to next
SUPPLIES: ${supplies}  |  Capacity: ${arcInfo.suppliesPassengers} Passengers, ${arcInfo.nextSuppliesCap - supplies} supplies to next
STRUCTURE: ${structure}  |  Capacity: ${arcInfo.structurePassengers} Passengers, ${arcInfo.nextStructureCap - structure} structure to next

**FINAL CAPACITY:** ${arcInfo.finalPassengers}
**CURRENT PASSENGERS:** ${passengers.length}
${passengersString}
`;

						await i.update({
							embeds: [makeEmbed(infoText + '\n\n(these buttons dont do anything yet)')], components: [await arcButtonInteractions(alreadyBoarded, enableLaunch)],
						});
					}
					else {
						// TODO this needs to change <3
						await i.update({ embeds: [makeEmbed('**ERROR:** Response not handled. If you see this in the final release please tell me.')], components: [] });
					}
				});

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

async function arcButtonPager(shipsArray, page) {
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
	const maxPages = Math.ceil(shipsArray.length / (MAX_SELECT_MENU_SIZE));
	ret.addComponents(
		new MessageButton()
			.setCustomId('info')
			.setLabel(`${page + 1} of ${maxPages}`)
			.setStyle('SECONDARY')
			.setDisabled(true),
	);
	if ((1 + page) * MAX_SELECT_MENU_SIZE <= shipsArray.length) {
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

async function arcSelectMenu(shipsArray, page, playersTable) {
	const ret = new MessageActionRow();
	const menu = new MessageSelectMenu()
		.setCustomId('arc')
		.setPlaceholder('Select an existing Arc.');
	for (let i = page * MAX_SELECT_MENU_SIZE; i < (page + 1) * MAX_SELECT_MENU_SIZE && i < shipsArray.length; i++) {
		const item = shipsArray[i];
		let passengers = shipsArray[i].passengers.split(',');
		if (passengers[0] === '') {
			passengers = [];
		}

		const user = await playersTable.findOne({ where: { userId: item.userId } });
		const name = await user.get('name');
		menu.addOptions([
			{
				label: `${name}'s Arc`,
				description: `${passengers.length} / ${item.capacity} Passengers.`,
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


const BASE_FUEL = 50;
const BASE_STRUCTURE = 100;
const BASE_SUPPLIES = 200;

function getFuelCost(passengers) {
	return Math.pow(BASE_FUEL, passengers);
}

function getStructureCost(passengers) {
	return BASE_STRUCTURE * passengers;
}

function getSuppliesCost(passengers) {
	return BASE_SUPPLIES * passengers;
}

function getShipInfo(fuel, structure, supplies) {
	const ret = {
		fuelPassengers: 0,
		structurePassengers: 0,
		suppliesPassengers: 0,
		nextFuelCap: getFuelCost(1),
		nextStructureCap: getStructureCost(1),
		nextSuppliesCap: getSuppliesCost(1),
		finalPassengers: 0,
	};

	while (ret.nextFuelCap <= fuel) {
		ret.fuelPassengers++;
		ret.nextFuelCap = getFuelCost(ret.fuelPassengers + 1);
	}
	ret.finalPassengers = ret.fuelPassengers;
	while (ret.nextStructureCap <= structure) {
		ret.structurePassengers++;
		ret.nextStructureCap = getStructureCost(ret.structurePassengers + 1);
	}
	if (ret.structurePassengers < ret.finalPassengers) {
		ret.finalPassengers = ret.structurePassengers;
	}
	while (ret.nextSuppliesCap <= supplies) {
		ret.suppliesPassengers++;
		ret.nextSuppliesCap = getSuppliesCost(ret.SuppliesPassengers + 1);
	}
	if (ret.suppliesPassengers < ret.finalPassengers) {
		ret.finalPassengers = ret.suppliesPassengers;
	}

	return ret;
}

async function arcButtonInteractions(alreadyBoarded, launching) {
	// ok, now i add 3 more buttons.
	// CONSTRUCT - donates *all* of your materials to the Arc.
	// BOARD - become a passenger of the Arc, dropping any ship you previously were a passenger of.
	// LAUNCH - launches the arc.

	// TODO this needs condition checks for displaying BOARD and LAUNCH buttons.
	const ret = new MessageActionRow();
	const addMaterials = new MessageButton()
		.setCustomId('addMaterials')
		.setLabel('DONATE ALL MATERIALS')
		.setStyle('SECONDARY');
	const board = new MessageButton()
		.setCustomId('board')
		.setLabel('BOARD ARC')
		.setStyle('PRIMARY')
		.setDisabled(alreadyBoarded);


	const launch = new MessageButton()
		.setCustomId('launch')
		.setLabel('LAUNCH ARC.')
		.setStyle('DANGER')
		.setDisabled(!launching);

	ret.addComponents(
		addMaterials,
		board,
		launch,
	);
	return ret;
}
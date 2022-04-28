const { SlashCommandBuilder } = require('@discordjs/builders');
const { makeEmbed, PURPLE } = require('../templates.js');

const CREDITS_TEXT =
`***__CREDITS:__***
**@aCactusOrSomething#0012** - *Programming, Data Entry, Original Concept*
**@nebulousHarmony#8772** - *Original Concept, Data Entry, Scenarios, Bug Testing*
**@Krysal Tepsyr#1417**  - *Original Concept*
**@fffnzzzfffff#9372 (aequorea)** - *Scenarios, Bug Testing*
**@broonloops#9997 (<https://broonloops.itch.io/>)** - *Scenarios*
**@MostOfAnEgg#3946** - *Scenarios*
**@•[ReddyRed]•#3560** - *Scenarios, Bug Testing*
**RingZeroSecurityLLD** - *Scenarios*
**@『M4-Y』#0956** - *Scenarios*
**@deadvoicesmedia** - *Scenarios* 
**sunnyaries (<https://sunnyaries.itch.io/>)** - *Scenarios, Bug Testing*
**@『R3-V, Upgrades Needed.』#9384** - *Bug Testing*
**@gullwingdoors#6462** - *Disclaimer Emeritus*

Icons from https://game-icons.net/, under CC BY-3.0

*__SPECIAL THANKS TO:__*
Andrew Hussie and The creators of Homestuck
FarragoFiction 
`;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('lists the developers.'),
	async execute(interaction) {
		await interaction.deferReply();
		const embed = makeEmbed(CREDITS_TEXT, PURPLE);
		await interaction.editReply({ embeds: [embed] });
	},
};

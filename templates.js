const { MessageEmbed } = require('discord.js');

const PURPLE = '#674ea7';
const GREEN = '#38761d';
const RED = '#ED4245';

const TITLE = 'A.S.H.E.S. Log';
const DISCLAIMER = 'A.S.H.E.S. is a work of fiction. Any similarities to events, locations, or persons (living or dead) that exist within the real world should not be taken as "real".';


function makeEmbed(mainText, color = PURPLE, footer = DISCLAIMER) {
	const embed = new MessageEmbed()
		.setColor(color)
		.setTitle(TITLE)
		.setDescription(mainText)
		.setFooter(footer);
	return embed;
}

module.exports = {
	PURPLE: PURPLE,
	GREEN: GREEN,
	RED: RED,
	DISCLAIMER: DISCLAIMER,

	makeEmbed: makeEmbed,
};
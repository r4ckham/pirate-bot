const Discord = require('discord.js');

module.exports = {
  createEmbededMessage: (
    color,
    title,
    gifUrl,
    message,
    punishment,
    punishmentMessage,
  ) => new Discord.MessageEmbed({
    color,
    title,
    description: `Carton au nom de : <@!${message.author.id}>`,
    thumbnail: {
      url: gifUrl,
    },
    fields: [
      {
        name: 'Phrase originale  :',
        value: message && message.content,
      },
      {
        name: "Note de l'arbitre",
        value: punishment.response || punishment,
      },
    ],
    timestamp: new Date(),
    footer: {
      text: punishmentMessage,
    },
  }),
};

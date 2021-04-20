const Discord = require('discord.js');
const UnbanCommand = require('./UnbanCommand');

class FabricCommand {
  static getCommand(commandName, message) {
    if (commandName === UnbanCommand.name) {
      return UnbanCommand;
    }

    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#ff001a')
      .setTitle('Commande non trouvée')
      .addFields(
        { name: '**uban**', value: 'remet un utilisateur en selle, la commande supprime le rouge et lui permet de rediscuter sur les channels!', inline: true },
      )
      .setTimestamp();

    message.channel.send(exampleEmbed);

    return null;
  }
}

module.exports = FabricCommand;

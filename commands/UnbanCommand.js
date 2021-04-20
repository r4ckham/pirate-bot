module.exports = {
  name: 'unban',
  description: 'Unban Command for hopeless users!',
  execute(message, targetUser) {
    const redCard = message.guild.roles.cache.find((r) => r.name === 'Carton Rouge');
    const user = message.guild.members.cache.find((p) => p.id === targetUser.id);

    if (user) {
      user.roles.remove(redCard).then(() => {
        message.guild.channels.cache.forEach((channel) => {
          channel.updateOverwrite(user, {
            SEND_MESSAGES: true,
          }).then(() => {
            channel.send(`Bon retour parmis nous <@${user.id}>`);
          });
        });
      });
    }
  },
};

module.exports = {
    name: 'unban',
    description: 'Unban Command for hopeless users!',
    execute(message, targetUser) {

        let redCard = message.guild.roles.cache.find(r => r.name === "Carton Rouge");
        let user = message.guild.members.cache.find(p=> p.id === targetUser.id);

        console.log(user);

        if(user){
            user.roles.remove(redCard).then(red => {
                message.guild.channels.cache.forEach(channel => {
                    channel.updateOverwrite(user, {
                        SEND_MESSAGES: true
                    }).then(r => {
                        channel.send(`Bon retour parmis nous <@${user.id}>`);
                    })
                })
            });
        }

    },
};
support = {
    name: 'invite',
    description: 'Get the link to invite me to another server.',
    parameters: '',
    requirement: 'none',
    execute(Discord, client, message, args, prefix) {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle('Partie Invite Link')
        .setDescription('[Invite Me](https://discord.com/api/oauth2/authorize?client_id=817608521679896586&permissions=837824081&scope=bot) to another server!')
        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
    }
}

module.exports = support
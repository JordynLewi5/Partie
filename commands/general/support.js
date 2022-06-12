support = {
    name: 'support',
    description: 'Get the link to the support server.',
    parameters: '',
    requirement: 'none',
    execute(Discord, client, message, args, prefix) {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle('Partie Support Server')
        .setDescription('Join the [support server](https://discord.gg/H5AFRkSkJ2) to report bugs, make suggestions, or ask questions.')
        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
    }
}

module.exports = support
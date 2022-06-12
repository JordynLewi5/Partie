premium = {
    name: 'premium',
    description: '**Get the link to my Patreon to support me and unlock premium features.**',
    parameters: '',
    requirement: 'developer',
    execute(Discord, client, message, args, prefix) {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle('Patreon')
        .setDescription('Click [here](https://www.patreon.com/partiebot?fan_landing=true) to visit my Patreon. Donating not only unlocks new features, but also really helps me to continue developing this and keep it online!')
        .setFooter('Once a pledge is made to the Patreon a message will be sent to your DMs with further instructions.')
        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
    }
}

module.exports = premium
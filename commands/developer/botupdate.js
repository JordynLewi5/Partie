access = {
    name: 'botupdate',
    description: 'Send an update to all servers with valid updates channel.',
    parameters: '[message]',
    requirement: 'developer',
    async execute (Discord, client, message, args) {
        message.channel.send('Are you sure you want to send this update? (yes/no)').then(msg => {
            
            msg.channel.awaitMessages(msg => msg.author.id === message.author.id, {
                max: 1,
                time: 40000
            }).then(collected => {
                if (collected.first().content.toLowerCase() !== 'yes') return
                let str = message.content.substring(args[0].length + client.Util.getGuildProfile(message.guild.id, client).settings.prefix.length + 1, message.content.length)
                client.guildProfileList.forEach(async guildProfile => {
                    if (guildProfile.botUpdateChannelID && guildProfile.botUpdateChannelID !== null) {
                        await client.guilds.cache.get(guildProfile.guildID).channels.cache.get(guildProfile.botUpdateChannelID).send(new Discord.MessageEmbed()
                            .setTitle('Partie Bot Update!')
                            .setDescription(str)
                            .setFooter('Please excuse any potential typos :)')
                            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
                    }
                })
            })
        })
    }
}
module.exports = access
const Discord = require('discord.js')
/**
 * Detect message in channel.
 * @param {*} client 
 * @param {*} config 
 */
function message(client, config) {
    //message event listener
    client.on('message', async message => {
        //if prefix is forgotten
        try {    
            if (message.mentions.members.first().id === client.user.id)
                return message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`Your server prefix is \`${client.Util.getGuildProfile(message.guild.id, client).settings.prefix}\`.`)
                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                )
        } catch {}
        
        if (message.author.bot || message.guild === null)
            return
                console.log(message.author.username, message.content)
        let guildProfile = client.Util.getGuildProfile(message.guild.id, client)
        //if (guildProfile === null) return client.emit('guildCreate', message.guild)

        if (!message.content.startsWith(guildProfile.settings.prefix))
            return
        
        let args = message.content.substring(guildProfile.settings.prefix.length, message.content.length).split(' ')
        let command = args[0].toLowerCase()

        if (client.commands.get(command).requirement === "leader") {
            if (!message.member.hasPermission('ADMINISTRATOR') && !client.Util.getGuildProfile(message.guild.id, client).commandToggles[client.Util.getGuildProfile(message.guild.id, client).commandToggles.findIndex(commandToggle => commandToggle.name === command)].toggle)
                return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Command Disabled.")
                .setDescription("This command has been disabled by a server admin.")
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))

            if (message.member.voice.channel === null || !client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client) || client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).leaderID !== message.author.id)
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Insufficient Permission.")
                .setDescription("Must be a party leader to use this command.")
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
        }

        if (client.commands.get(command).requirement === "admin" && !message.member.hasPermission('ADMINISTRATOR') && message.member.id !== '599075619178807312') {
            if (message.member.voice.channel === null || !client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client) || client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).leaderID !== message.author.id)
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Insufficient Permission.")
                .setDescription("Must be a server admin to use this command.")
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
        }

        try {
            await client.commands.get(command).execute(Discord, client, message, args, guildProfile.settings.prefix)
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports = message
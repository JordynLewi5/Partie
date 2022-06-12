const Discord = require('discord.js')
const Guild = require('../manager/GuildProfile.js')
const reload = require('../manager/Reload.js')

/**
 * When the bot is added to new guild create a profile class for the guild.
 */
function guildCreate(client, config) {

    client.on('guildCreate', guild => {
        console.log('guild added')
        let toggleCommands = []
        Array.from(client.commands).forEach(command => {
            if (command[1].requirement === 'leader') {
                toggleCommands.push({
                    name: command[0],
                    toggle: true
                })
            }
        })
        if (!client.Util.getGuildProfile(guild.id, client)) {

            client.guildProfileList.push(new Guild(guild.id, config.settings, [], [], toggleCommands, false, config.botUpdateChannelID))
            localStorage.setItem('GuildProfileList', JSON.stringify(client.guildProfileList))
        }
        //update local storage
        try {
            // guild.systemChannel.send(new Discord.MessageEmbed()
            //     .setTitle('Thanks for adding me to your server!')
            //     .setDescription(`I can create awesome temporary private text and voice channels, and parties that are highly configurable to bring your server to the next level! There are many commands that your server's members can use to customize their own parties.
                
            //     You can check out all of my commands by using \`${config.settings.prefix}help\`. To configure me to your server preferences use the command \`${config.settings.prefix}config\` where you will be able to change my command prefix and more if you need to.`)
            //     .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
            // )
        } catch (error) {
            // console.log(error)
        }
    })
}

module.exports = guildCreate

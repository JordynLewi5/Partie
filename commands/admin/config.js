const { MessageActionRow } = require("discord-buttons")

const settings = ['prefix', 'permissions']
config = {
    name: 'config',
    description: 'Configure me to your preferences.',
    parameters: '',
    requirement: 'admin',
    async execute(Discord, client, message, args, prefix) {

        let PREFIX_BUTTON = new client.disbut.MessageButton()
            .setStyle('blurple')
            .setLabel('Prefix')
            .setID('edit_prefix')

        let BOT_UPDATES_BUTTON = new client.disbut.MessageButton()
            .setStyle('blurple')
            .setLabel('Bot Updates Channel')
            .setID('bot_updates')
        
        const CANCEL_BUTTON = new client.disbut.MessageButton()
            .setStyle('grey')
            .setLabel('Cancel')
            .setID('cancel')

        await message.channel.send(
            {
                embed: new Discord.MessageEmbed()
                .setTitle('Configuration Menu')
                .setDescription(`**Current Settings:**
                *Prefix: \`${client.Util.getGuildProfile(message.guild.id, client).settings.prefix}\`*
                *Bot Updates Channel: ${client.Util.getGuildProfile(message.guild.id, client).botUpdateChannelID !== null? `<#${client.Util.getGuildProfile(message.guild.id, client).botUpdateChannelID}>`:'`disabled`'}*
                
                Please select a setting to configure.`)
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'), 
                buttons: [PREFIX_BUTTON, BOT_UPDATES_BUTTON, CANCEL_BUTTON],
            }
        ).then(async msg => {

            await msg.awaitButtons(button => button.clicker.user.id === message.author.id, {
                    time: 20000, 
                    max: 1
                }).then(async buttons => {
                try {
                    await msg.delete()
                } catch {}
                if (!buttons.first() || buttons.first().id === 'cancel') return                
                buttons.first().reply.defer()

                switch (buttons.first().id) {

                    //edit the guild prefix
                    case 'edit_prefix':
                        msg.channel.send({
                            embed: new Discord.MessageEmbed()
                                .setTitle('Config: Prefix')
                                .setDescription('Please respond with a new prefix. Must be **less** than or **equal** to **3** characters in length and include no spaces. Prefix also cannot be `/`, due to slash command interference.')
                                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                            buttons: [CANCEL_BUTTON]
                        }).then(editMessage => {
                            editMessage.awaitButtons(button => button.clicker.user.id === message.author.id, {
                                max: 1,
                                time: 20000
                            }).then(async buttons => {
                                try {
                                    await editMessage.delete()
                                } catch {}
                            })

                            editMessage.channel.awaitMessages(msg => msg.author.id == message.author.id, {
                                max: 1,
                                time: 20000
                            }).then(async collected => {
                                try {
                                    await editMessage.delete()
                                } catch {}
                                if (!collected.first()) return
    
                                collected = collected.first().content
                                
                                let valid = true
    
                                if (collected.length <= 3) {
    
                                    collected.split('').forEach(char => {
                                        if (char === ' ') {
                                            valid = false
                                        }
                                    })
                                } else {
                                    valid = false
                                }

                                if (collected === '/') valid = false
    
                                if (valid) {
                                    client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === message.guild.id)].settings.prefix = collected
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setTitle(`Prefix changed!`)
                                        .setDescription(`Your new prefix is \`${collected}\`. To change it back use the same command with your new prefix.`)
                                        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                    )
                                } else {
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setTitle(`Unable to change prefix.`)
                                        .setDescription(`Please follow the prefix format provided.`)
                                        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                    )
                                }
                            })
                        })
                        


                        break
                    
                    //edit some other guild setting
                    case 'bot_updates':
                        let NO_BOT_UPDATES_BUTTON = new client.disbut.MessageButton()
                            .setStyle('red')
                            .setLabel('Don\'t Receive Notifications')
                            .setID('no_bot_updates')

                        let menu = new client.disbut.MessageMenu()
                            .setID('editMenu')
                            .setPlaceholder('Click here to select creation channel.')
                            .setMaxValues(1)
                            .setMinValues(1)
                
                        let textChannels = client.guilds.cache.get(message.guild.id).channels.cache.filter(channel => channel.type === 'text')
                        if (textChannels.size === 0) return

                        textChannels.forEach(textChannel => {
                            let option = new client.disbut.MessageMenuOption()
                                .setLabel(`#${textChannel.name}`)
                                .setEmoji('#️⃣')
                                .setValue(textChannel.id)
                                .setDescription(`𝕀𝔻: ${textChannel.id}`)
                            menu.addOption(option)
                        })
                        message.channel.send({
                            embed: new Discord.MessageEmbed()
                            .setTitle('Config: Bot Updates Channel')
                            .setDescription('Select a channel to send bot updates so you don\'t miss out on new features.')
                            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                            menus: menu,
                            buttons: [NO_BOT_UPDATES_BUTTON, CANCEL_BUTTON]
                        }).then(botUpdatesMessage => {
                            botUpdatesMessage.awaitButtons(button => button.clicker.user.id === message.author.id, {
                                max: 1,
                                time: 20000
                            }).then(async buttons => {
                                try {
                                    await botUpdatesMessage.delete()
                                } catch {}
                                if (!buttons.first() || buttons.first().id === 'cancel') return
                                if (buttons.first().id === 'no_bot_updates') {
                                    client.Util.getGuildProfile(message.guild.id, client).setBotUpdateChannel(null)
                                    message.channel.send(new Discord.MessageEmbed()
                                        .setTitle('Successfully disabled bot update notifications.')
                                        .setDescription('You won\'t recieve notifications about new bot updates.')
                                        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                    )
                                }
                            })

                            botUpdatesMessage.awaitMenus(menu => menu.clicker.user.id === message.author.id, {
                                max: 1,
                                time: 20000
                            }).then(async items => {
                                try {
                                    await botUpdatesMessage.delete()
                                } catch {}
                                if (!items.first()) return
                                client.Util.getGuildProfile(message.guild.id, client).setBotUpdateChannel(items.first().values[0])
                                message.channel.send(new Discord.MessageEmbed()
                                    .setTitle('Successfully enabled bot update notifications.')
                                    .setDescription(`Bot update notifications will be sent to <#${items.first().values[0]}>.`)
                                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                            )
                            })             
                        })
                        break
                }
            })
        })        
    }
}

module.exports = config
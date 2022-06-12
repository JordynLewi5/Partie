edit = {
    name: 'edit',
    description: 'Edit existing creation channels\' party settings.',
    parameters: '',
    requirement: 'admin',
    execute(Discord, client, message) {
        if (client.Util.getGuildProfile(message.guild.id, client).creationChannels.length === 0) {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle('No creation channels to edit.')
                .setDescription(`You need to set up atleast one creation channel to edit. Use \`${client.Util.getGuildProfile(message.guild.id, client).settings.prefix}setup\` to set one up.`)
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
        }
        const CANCEL_BUTTON = new client.disbut.MessageButton()
            .setStyle('grey')
            .setLabel('Cancel')
            .setID('cancel')

        let editMenu = new client.disbut.MessageMenu()
            .setID('editMenu')
            .setPlaceholder('Click here to select creation channel.')
            .setMaxValues(1)
            .setMinValues(1)

        client.Util.getGuildProfile(message.guild.id, client).creationChannels.forEach(creationChannel => {
            let voiceChannel = client.guilds.cache.get(creationChannel.guildID).channels.cache.get(creationChannel.creationChannelID)
            let parentChannel = client.guilds.cache.get(creationChannel.guildID).channels.cache.get(creationChannel.parentChannelID)
            let option = new client.disbut.MessageMenuOption()
                .setLabel(voiceChannel.name)
                .setEmoji('🔊')
                .setValue(voiceChannel.id)
                .setDescription(`𝕋𝕪𝕡𝕖: ${creationChannel.type} 𝕀𝔻: ${creationChannel.creationChannelID}`)

            editMenu.addOption(option)
        })

        message.channel.send({
            embed: new Discord.MessageEmbed()
            .setTitle('Party Settings Editor')
            .setDescription('Please select the creation channel you would like to edit below.')
            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'), 
            menus: editMenu, 
            buttons: [CANCEL_BUTTON]}).then(async menuMessage => {
                menuMessage.awaitButtons(buttons => buttons.clicker.user.id === message.author.id, {
                    max: 1,
                    time: 20000
                }).then(buttons => {
                    try {
                        menuMessage.delete()
                    } catch {}
                    if (!buttons.first() || buttons.first().id === 'cancel') return
                })
                menuMessage.awaitMenus(menu => menu.clicker.user.id === message.author.id, {
                    max: 1,
                    time: 20000
                }).then(async items => {
                    try {
                        menuMessage.delete()
                    } catch {}
                    if (!items.first()) return
                    const voiceID = items.first().values[0]

                    const TYPE_BUTTON = new client.disbut.MessageButton()
                    .setStyle('blurple')
                    .setLabel('Type')
                    .setID('type')

                    const DEFAULT_MODE_BUTTON = new client.disbut.MessageButton()
                    .setStyle('blurple')
                    .setLabel('Default Privacy Mode')
                    .setID('mode')

                    const LIMIT_BUTTON = new client.disbut.MessageButton()
                    .setStyle('blurple')
                    .setLabel('User Limit')
                    .setID('limit')

                    message.channel.send({
                        embed: new Discord.MessageEmbed()
                        .setTitle('Party Settings Editor')
                        .setDescription('Choose the setting you would like to edit.')
                        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                        buttons: [TYPE_BUTTON, DEFAULT_MODE_BUTTON, LIMIT_BUTTON, CANCEL_BUTTON]}).then(buttonsMessage => {
                            buttonsMessage.awaitButtons(buttons => buttons.clicker.user.id === message.author.id, {
                                max: 1,
                                time: 20000
                            }).then(async buttons => {
                                try {
                                    await buttonsMessage.delete()
                                } catch {}
                                if (!buttons.first() || buttons.first().id === 'cancel') return 
                                switch (buttons.first().id) {
                                    case 'type':
                                        let VOICE_BUTTON = new client.disbut.MessageButton()
                                        .setStyle('blurple')
                                        .setLabel('Voice')
                                        .setID('Voice')
                            
                                        let VOICE_AND_TEXT_BUTTON = new client.disbut.MessageButton()
                                            .setStyle('blurple')
                                            .setLabel('Voice & Text')
                                            .setID('Voice & Text')

                                        message.channel.send({
                                            embed: new Discord.MessageEmbed()
                                            .setTitle('Party Settings Editor')
                                            .setDescription('Please choose the creation channel **type** you would like.')
                                            .setFooter('Note: Changing the type will not edit any category or channel names.')
                                            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                                            buttons: [VOICE_BUTTON, VOICE_AND_TEXT_BUTTON, CANCEL_BUTTON]}).then(typeMessage => {
                                            typeMessage.awaitButtons(button => button.clicker.user.id === message.author.id, {
                                                max: 1,
                                                time: 20000
                                            }).then(async buttons => {
                                                try {
                                                    await typeMessage.delete()
                                                } catch {}
                                                if (!buttons.first() || buttons.first().id === 'cancel') return
                                                client.Util.getCreationChannelProfile(message.guild.id, voiceID, client).setType(buttons.first().id)
                                                message.channel.send(new Discord.MessageEmbed()
                                                    .setTitle('Party Settings Editors')
                                                    .setDescription('Successfully changed creation channel type!')
                                                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
                                            })
                                        })
                                        break
                                    case 'limit':
                                        let NO_LIMIT_BUTTON = new client.disbut.MessageButton()
                                            .setStyle('red')
                                            .setLabel('No Limit')
                                            .setID('none')

                                        message.channel.send({
                                            embed: new Discord.MessageEmbed()
                                                .setTitle('Party Settings Editor')
                                                .setDescription('Enter a value **1 - 99** or click **no limit**.')
                                                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                                            buttons: [NO_LIMIT_BUTTON, CANCEL_BUTTON]
                                        }).then(limitMessage => {
                                            limitMessage.awaitButtons(buttons => buttons.clicker.user.id === message.author.id, {
                                                max: 1,
                                                time: 20000
                                            }).then(async buttons => {
                                                try {
                                                    await limitMessage.delete()
                                                } catch {}
                                                if (!buttons.first() || buttons.first().id === 'cancel') return
                                                client.Util.getCreationChannelProfile(message.guild.id, voiceID, client).setLimit(client, null)
                                                message.channel.send(new Discord.MessageEmbed()
                                                    .setTitle('Party Settings Editor')
                                                    .setDescription('Successfully changed party user limit!')
                                                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
                                            })
                                            limitMessage.channel.awaitMessages(msg => msg.author.id === message.author.id, {
                                                max: 1,
                                                time: 20000
                                            }).then(async messages => {
                                                try {
                                                    await limitMessage.delete()
                                                } catch {}
                                                if (!messages.first()) return
                                                if (isNaN(messages.first().content) || messages.first().content < 1 || messages.first().content > 99) {
                                                    return message.channel.send(new Discord.MessageEmbed()
                                                        .setTitle('Party Settings Editor')
                                                        .setDescription('**Unable** to change user limit to that value, please try again.'))
                                                }
                                                client.Util.getCreationChannelProfile(message.guild.id, voiceID, client).setLimit(client, messages.first().content)
                                                message.channel.send(new Discord.MessageEmbed()
                                                    .setTitle('Party Settings Editor')
                                                    .setDescription('Successfully changed party user limit!')
                                                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
                                            })
                                        })
                                        break
                                    case 'mode':
                                        let PUBLIC_BUTTON = new client.disbut.MessageButton()
                                        .setStyle('blurple')
                                        .setLabel('Public')
                                        .setID('public')
                            
                                        let PRIVATE_BUTTON = new client.disbut.MessageButton()
                                            .setStyle('blurple')
                                            .setLabel('Private')
                                            .setID('private')

                                        message.channel.send({
                                            embed: new Discord.MessageEmbed()
                                            .setTitle('Party Settings Editor')
                                            .setDescription('Please choose a default **privacy mode**.')
                                            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                                            buttons: [PUBLIC_BUTTON, PRIVATE_BUTTON, CANCEL_BUTTON]}).then(typeMessage => {
                                            typeMessage.awaitButtons(button => button.clicker.user.id === message.author.id, {
                                                max: 1,
                                                time: 20000
                                            }).then(async buttons => {
                                                try {
                                                    await typeMessage.delete()
                                                } catch {}
                                                if (!buttons.first() || buttons.first().id === 'cancel') return
                                                client.Util.getCreationChannelProfile(message.guild.id, voiceID, client).setDefaultMode(client, buttons.first().id)
                                                message.channel.send(new Discord.MessageEmbed()
                                                    .setTitle('Party Settings Editors')
                                                    .setDescription('Successfully changed default **privacy mode**!')
                                                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
                                            })
                                        })
                                        break
                                }
                            })
                        })

                    
                })
            })
    }
}

module.exports = edit
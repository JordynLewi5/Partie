const Discord = require('discord.js')
const CreationChannel = require('../../manager/CreationChannel.js')

/**
 * Setup command.
 */
setup = {
    name: 'setup',
    description: 'Setup party creation channels.',
    parameters: '',
    requirement: 'admin',
    async execute (Discord, client, message, args, prefix) {
        let guildProfile = findObjectByKey(client.guildProfileList, 'guildID', message.guild.id)
        if(!guildProfile) {
            client.emit('guildCreate', message.guild)
            message.channel.send(new Discord.MessageEmbed()
                .setTitle(`A problem occurred.`)
                .setDescription(`This problem should now be resolved, please try again now.`)
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
            )
        }

        if (client.Util.getNumberOfCCInGuild(message.guild.id, client) === client.Util.getGuildProfile(message.guild.id, client).settings.maxCreationChannels) {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle('Unable to set up new creation channel.')
                .setDescription(`You have reached the max number of creation channels allowed for non-premium servers **(${client.Util.getGuildProfile(message.guild.id, client).settings.maxCreationChannels})**. To create more creation channels you need to link your premium account to the server. *Premium accounts have not been set up yet, but will be soon.*`)
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
            )
        }

        if (client.Util.getGuildProfile(message.guild.id, client).setupInProgress) {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle('Unable to set up new creation channel.')
                .setDescription("Please finish the current set up process before beginning a new one.")
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
            )
        } else {
            client.Util.getGuildProfile(message.guild.id, client).setupInProgress = true
        }

        //buttons
        let VOICE_BUTTON = new client.disbut.MessageButton()
            .setStyle('blurple')
            .setLabel('Voice')
            .setID('Voice')

        let VOICE_AND_TEXT_BUTTON = new client.disbut.MessageButton()
            .setStyle('blurple')
            .setLabel('Voice & Text')
            .setID('Voice & Text')

        let CANCEL_BUTTON = new client.disbut.MessageButton()
            .setStyle('grey')
            .setLabel('Cancel')
            .setID('cancel')

        //send message with setup options
        await message.channel.send({
            embed: new Discord.MessageEmbed()
                .setTitle(`Creation Channel Setup`)
                .setDescription(`Select one of the following creation channel types.`)
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
            buttons: [VOICE_BUTTON, VOICE_AND_TEXT_BUTTON, CANCEL_BUTTON]
        }).then(msg1 => {
            msg1.awaitButtons(button => button.clicker.user.id === message.author.id, {
                time: 20000,
                max: 1
            }).then(async buttons => {
                try {
                    await msg1.delete()
                } catch {}
                if (buttons.first() === undefined || buttons.first().id === 'cancel') {
                    client.Util.getGuildProfile(message.guild.id, client).setupInProgress = false
                    return
                }
                msg1.components[0].components.forEach(button => {
                    button.setDisabled(true)
                })
                buttons.first().reply.defer()

                let type = buttons.first().id;

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
                        .setTitle(`Creation Channel Setup`)
                        .setDescription(`Select a default privacy mode upon creating a party.`)
                        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                    buttons: [PUBLIC_BUTTON, PRIVATE_BUTTON, CANCEL_BUTTON]
                }).then(modeMessage => {
                    modeMessage.awaitButtons(button => button.clicker.user.id === message.author.id, {
                        time: 20000,
                        max: 1
                    }).then(async buttons => {
                        try {
                            await modeMessage.delete()
                        } catch {}

                        if (!buttons.first() || buttons.first().id === 'cancel') {
                            client.Util.getGuildProfile(message.guild.id, client).setupInProgress = false
                            return
                        }

                        let defaultMode = buttons.first().id
                        console.log(defaultMode)

                        let limit
                        //buttons
                        let YES_BUTTON = new client.disbut.MessageButton()
                        .setStyle('green')
                        .setLabel('Yes')
                        .setID('yes')
        
                        let NO_BUTTON = new client.disbut.MessageButton()
                        .setStyle('red')
                        .setLabel('No')
                        .setID('no')
        
                        let NO_LIMIT_BUTTON = new client.disbut.MessageButton()
                        .setStyle('red')
                        .setLabel('No Limit')
                        .setID('none')

                        message.channel.send({
                            embed: new Discord.MessageEmbed()
                            .setTitle('Creation Channel Setup')
                            .setDescription(`Would you like to set a default user limit?`)
                            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                            buttons: [YES_BUTTON, NO_BUTTON, CANCEL_BUTTON]
                        }).then(msg2 => {
                            msg2.awaitButtons(button => button.clicker.user.id === message.author.id, {
                                time: 20000,
                                max: 1
                            }).then(async buttons => {
                                try {
                                    await msg2.delete()
                                } catch {}
                                if (!buttons.first() || buttons.first().id === 'cancel') {
                                    client.Util.getGuildProfile(message.guild.id, client).setupInProgress = false
                                    return
                                }
                                msg2.components[0].components.forEach(button => {
                                    button.setDisabled(true)
                                })
                                buttons.first().reply.defer()

                                //Set default user limit
                                if (buttons.first().id === 'yes') {
                                    let msg3 = await message.channel.send({
                                        embed: new Discord.MessageEmbed()
                                        .setTitle('Creation Channel Setup')
                                        .setDescription('Please **type** a default user limit **(1 - 99)**.')
                                        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'),
                                        buttons: [NO_LIMIT_BUTTON, CANCEL_BUTTON]
                                    })
                                    let buttonClicked = false
                                    msg3.awaitButtons(button => button.clicker.user.id === message.author.id, {
                                        time: 20000,
                                        max: 1
                                    }).then(async buttons => {
                                        try {
                                            await msg3.delete()
                                        } catch {}
                                        buttonClicked = true
                                        if (buttons.first() && buttons.first().id === 'none') {
                                            limit = null

                                            try {
                                                message.guild.channels.create(`${type} party creator`, { 
                                                    type: 'category',
                                                    permissionOverwrites: []
                                                }).then(async channel => {
                                                    let parentChannel = channel
                                                    await message.guild.channels.create(`Join to create!`, {
                                                        type: 'voice',
                                                        parent: channel.id,
                                                        permissionOverwrites: [
                                                            {
                                                                id: message.guild.roles.everyone.id,
                                                                allow: ['CONNECT', 'VIEW_CHANNEL'],
                                                            },
                                                            {
                                                                id: client.user.id,
                                                                allow: ['VIEW_CHANNEL']
                                                            }
                                                        ]
                                                    }).then(async channel => {
                                                        let creationChannel = channel
                                                        await message.guild.channels.create(`${type} Parties`, { 
                                                            type: 'category',
                                                            permissionOverwrites: [],
                                                            position: parentChannel.position + 1
                                                        }).then(async channel => {
                                                            let parentChannel = channel
                                                            client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === message.guild.id)].creationChannels.push(new CreationChannel(message.guild.id, type, creationChannel.id, parentChannel.id, limit, defaultMode))
                                                            await message.channel.send(new Discord.MessageEmbed()
                                                                .setTitle(`Successfully created creation channel.`)
                                                                .setDescription(`Enjoy your new \`${type}\` party creation channel!`)
                                                                .setFooter('Note: The delay when creating a party is simply to protect from rate limit spam.')
                                                                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                                            )
                                                            client.Util.getGuildProfile(message.guild.id, client).setupInProgress = false
                                                        })
                                                    })
                                                })
                                                
                                            } catch (error) {
                                                console.log(error)
                                                if (error.name === 'DiscordAPIError') {
                                                    message.channel.send(new Discord.MessageEmbed()
                                                        .setTitle(`Unable to create creation channel.`)
                                                        .setDescription(`Check to make sure I have the \`administrator\` permission.`)
                                                        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                                    )
                                                }
                                            }
                                        } else if (buttons.first() || buttons.first().id === 'cancel') {
                                            client.Util.getGuildProfile(message.guild.id, client).setupInProgress = false
                                            return
                                        }
                                    })


                                    message.channel.awaitMessages(msg => msg.author.id === message.author.id, {
                                        time: 20000,
                                        max: 1
                                    }).then(async msg4 => {
                                        try {
                                            await msg4.delete()
                                        } catch {}
                                        if (buttonClicked) return
                                        //CREATE CREATION CHANNEL
                                        if (msg4 && isNaN(parseInt(msg4.first().content)) || msg4.first().content > 99 || msg4.first().content < 1) {
                                            client.Util.getGuildProfile(message.guild.id, client).setupInProgress = false
                                        
                                            return message.channel.send(new Discord.MessageEmbed()
                                                .setTitle('Invalid value provided.')
                                                .setDescription('Please begin the setup process again.')
                                                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
                                        }

                                        limit = parseInt(msg4.first().content)

                                        try {
                                            message.guild.channels.create(`${type} party creator`, { 
                                                type: 'category',
                                                permissionOverwrites: []
                                            }).then(async channel => {
                                                let parentChannel = channel
                                                await message.guild.channels.create(`Join to create!`, {
                                                    type: 'voice',
                                                    parent: channel.id,
                                                    permissionOverwrites: [
                                                        {
                                                            id: message.guild.roles.everyone.id,
                                                            allow: ['CONNECT', 'VIEW_CHANNEL'],
                                                        },
                                                        {
                                                            id: client.user.id,
                                                            allow: ['VIEW_CHANNEL']
                                                        }
                                                    ]
                                                }).then(async channel => {
                                                    let creationChannel = channel
                                                    await message.guild.channels.create(`${type} Parties`, { 
                                                        type: 'category',
                                                        permissionOverwrites: [],
                                                        position: parentChannel.position + 1
                                                    }).then(async channel => {
                                                        let parentChannel = channel
                                                        client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === message.guild.id)].creationChannels.push(new CreationChannel(message.guild.id, type, creationChannel.id, parentChannel.id, limit, defaultMode))
                                                        await message.channel.send(new Discord.MessageEmbed()
                                                            .setTitle(`Successfully created creation channel.`)
                                                            .setDescription(`Enjoy your new \`${type}\` party creation channel!`)
                                                            .setFooter('Note: The delay when creating a party is simply to protect from rate limit spam.')
                                                            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                                        )
                                                        client.Util.getGuildProfile(message.guild.id, client).setupInProgress = false
                                                    })
                                                })
                                            })
                                            
                                        } catch (error) {
                                            console.log(error)
                                            if (error.name === 'DiscordAPIError') {
                                                message.channel.send(new Discord.MessageEmbed()
                                                    .setTitle(`Unable to create creation channel.`)
                                                    .setDescription(`Check to make sure I have the \`administrator\` permission.`)
                                                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                                )
                                            }
                                        }
                                    })
                                } else {
                                    limit = null
                                    //CREATE CREATION CHANNEL
                                    try {
                                        message.guild.channels.create(`${type} party creator`, { 
                                            type: 'category',
                                            permissionOverwrites: []
                                        }).then(async channel => {
                                            let parentChannel = channel
                                            await message.guild.channels.create(`Join to create!`, {
                                                type: 'voice',
                                                parent: channel.id,
                                                permissionOverwrites: [
                                                    {
                                                        id: message.guild.roles.everyone.id,
                                                        allow: ['CONNECT', 'VIEW_CHANNEL'],
                                                    },
                                                    {
                                                        id: client.user.id,
                                                        allow: ['VIEW_CHANNEL']
                                                    }
                                                ]
                                            }).then(async channel => {
                                                let creationChannel = channel
                                                await message.guild.channels.create(`${type} Parties`, { 
                                                    type: 'category',
                                                    permissionOverwrites: [],
                                                    position: parentChannel.position + 1
                                                }).then(async channel => {
                                                    let parentChannel = channel
                                                    client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === message.guild.id)].creationChannels.push(new CreationChannel(message.guild.id, type, creationChannel.id, parentChannel.id, limit, defaultMode))
                                                    await message.channel.send(new Discord.MessageEmbed()
                                                        .setTitle(`Successfully created creation channel.`)
                                                        .setDescription(`Enjoy your new \`${type}\` party creation channel!`)
                                                        .setFooter('Note: The delay when creating a party is simply to protect from rate limit spam.')
                                                        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                                    )
                                                    try {
                                                        await msg1.delete()
                                                    } catch {}
                                                    try {
                                                        await msg2.delete()
                                                    } catch {}
                                                    try {
                                                        await msg3.delete()
                                                    } catch {}
                                                    try {
                                                        await msg4.delete()
                                                    } catch {}
                                                    client.Util.getGuildProfile(message.guild.id, client).setupInProgress = false                                        
                                                })
                                            })
                                        })
                                        
                                    } catch (error) {
                                        console.log(error)
                                        if (error.name === 'DiscordAPIError') {
                                            message.channel.send(new Discord.MessageEmbed()
                                                .setTitle(`Unable to create creation channel.`)
                                                .setDescription(`Check to make sure I have the \`administrator\` permission.`)
                                                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
                                            )
                                        }
                                    }
                                }    
                            })
                        })
                    })
                })
            })
        })
    }
}
/**
 * Finds an object within an array by searching for
 * a value of a specified property.
 * @param {array} array - Array to search
 * @param {string} key - Property of object in array.
 * @param {string} value - Value of specified property.
 * @returns {array} object - The object being searched for.
 */
 function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}
module.exports = setup
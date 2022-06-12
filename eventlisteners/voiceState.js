const CreationChannel = require('../manager/CreationChannel.js')
const reload = require('../manager/Reload.js')
const Discord = require('discord.js')
/**
 * Detect voice state updates.
 * @param {*} client 
 * @param {*} config 
 */
function voiceStateUpdate(client, config) {

    client.on('voiceStateUpdate', (oldState, newState) => {
        if (newState.channel !== null) {
            //user is in a channel
            if (oldState.channel !== null) {
                if (newState.channel === oldState.channel) 
                    return console.log(`${newState.member.user.username} updated a voice setting.`)
                    
                //user switched channels
                userSwitchedChannel(oldState, newState, client)

            } else {
                //user joined channel
                userJoinedChannel(oldState, newState, client)
            }
        } else {
            //user is not in a channel
            if (oldState.channel !== null) {
                //user left channel
                userLeftChannel(oldState, newState, client)
            } else {
                //user was never in channel
                //do nothing...?
                console.log('Something Unexpected happened..')
            }
        }

    })
}

//methods

/**
 * When a user switches a channel.
 * @param {Object} oldState 
 * @param {Object} newState 
 */
function userSwitchedChannel(oldState, newState, client) {
    
    console.log(`${newState.member.user.username} switched channels.`)


    // if(client.Util.getPartyProfile(newState.guild.id, oldState.channel.id, client) && client.Util.getCreationChannelProfile(newState.guild.id, newState.channel.id, client))
    //     return newState.member.voice.setChannel(newState.guild.channels.cache.get(client.Util.getPartyProfile(newState.guild.id, oldState.channel.id, client).voiceID))

    let creationChannel = client.Util.getCreationChannelProfile(newState.guild.id, newState.channel.id, client)
    
    if(creationChannel) {
        console.log('Creating channel ...')
        //create party
        creationChannel.createParty(creationChannel.getType(), newState.member, creationChannel, newState.guild, client)
    }
    
    client.Util.getGuildProfile(newState.guild.id, client).parties.forEach(async party => {
        if(oldState.channel.id === party.voiceID) {
            let memberCount = 0
            await oldState.channel.members.forEach(member => {
                if (!member.user.bot) memberCount++
            })
            try {
                if (memberCount === 0)
                    client.Util.getPartyProfile(newState.guild.id, oldState.channel.id, client).deleteParty(client)
            } catch(err) {
                //console.log(err)
            }
        }
    })

    client.Util.getGuildProfile(newState.guild.id, client).parties.forEach(async party => {
        if(newState.channel.id === party.voiceID) {
           client.Util.getPartyProfile(newState.guild.id, newState.channel.id, client).addMember(client, newState.member.user.id)
        }
    })
}

/**
 * When a user joins a channel.
 * @param {Object} oldState 
 * @param {Object} newState 
 */
 function userJoinedChannel(oldState, newState, client) {
    console.log(`${newState.member.user.username} joined a channel.`)
    let creationChannel = client.Util.getCreationChannelProfile(newState.guild.id, newState.channel.id, client)
    if(creationChannel) {
        console.log('Creating channel ...')
        //create party
        creationChannel.createParty(creationChannel.getType(), newState.member, creationChannel, newState.guild, client)
    }
    
    client.Util.getGuildProfile(newState.guild.id, client).parties.forEach(async party => {
        if(newState.channel.id === party.voiceID) {
           client.Util.getPartyProfile(newState.guild.id, newState.channel.id, client).addMember(client, newState.member.user.id)
        }
    })
}

/**
 * When a user leaves a channel.
 * @param {Object} oldState 
 * @param {Object} newState 
 */
 function userLeftChannel(oldState, newState, client) {
    console.log(`${newState.member.user.username} left a channel.`)
    client.Util.getGuildProfile(newState.guild.id, client).parties.forEach(async party => {
        if(oldState.channel.id === party.voiceID) {
            let memberCount = 0
            await oldState.channel.members.forEach(member => {
                if (!member.user.bot) memberCount++
            })
            try {
                if (memberCount === 0) {
                    client.Util.getPartyProfile(newState.guild.id, oldState.channel.id, client).deleteParty(client)
                } else {
                    client.Util.getPartyProfile(newState.guild.id, oldState.channel.id, client).setLeader(client, oldState.channel.members.first().user.id)
                    oldState.channel.members.first().send(new Discord.MessageEmbed()
                        .setTitle('You are now the new party leader.')
                        .setDescription(`The previous party leader has left the voice channel, so leadership has been transferred to you. You can now use party commands. Use \`${client.Util.getGuildProfile(oldState.guild.id, client).settings.prefix}help\` for a list of my commands.`))
                }
            } catch(err) {
                console.log(err)
            }
        }
    })
}

module.exports = voiceStateUpdate
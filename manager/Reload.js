let i = 0

/**
 * Reloads all of the classes.
 * @param {*} client 
 */
function reload(client){
    const CreationChannel = require('./CreationChannel.js')
    const GuildProfile = require('./GuildProfile.js')
    const Party = require('./Party.js')

    let guildProfileList = []
    

    if (client.guildProfileList.length === 0) {
        //Add guilds that may have been previously missed.
        client.guilds.cache.map(guild => {
            if (!client.Util.getGuildProfile(guild.id, client)) {
                client.emit('guildCreate', guild)
            }
        })

        guildProfileList = JSON.parse(localStorage.getItem('GuildProfileList'))

    } else {
        //Add guilds that may have been previously missed.
    client.guilds.cache.map(guild => {
        if (!client.Util.getGuildProfile(guild.id, client)) {
            client.emit('guildCreate', guild)
        }
    })
        guildProfileList = client.guildProfileList
    }

    client.guildProfileList = []

    //load guilds
    guildProfileList.forEach(async guildProfile => {

        let guild = client.guilds.cache.get(guildProfile.guildID)

        if (guild) {
            
            //load creation channels
            let creationChannels = []
            guildProfile.creationChannels.forEach(creationChannel => {
                if (guild.channels.cache.get(creationChannel.creationChannelID) !== undefined) {
                    //Add recreated creation channel class to the creation channnels list in each guild.
                    if (!creationChannel.defaultMode) creationChannel.defaultMode = 'private'
                    creationChannels.push(new CreationChannel(creationChannel.guildID, creationChannel.type, creationChannel.creationChannelID, creationChannel.parentChannelID, creationChannel.limit, creationChannel.defaultMode))
                }

            })

            //load parties
            let parties = []
            guildProfile.parties.forEach(async party => {

                //Add recreated party class to the party list in each guild.

                //check if parties are empty
                try {
                    if (guild.channels.cache.get(party.voiceID) && guild.channels.cache.get(party.voiceID).members.size === 0 && Date.now() - parseInt(party.createdAtMS) > 1500) {
                        //Party is empty, or has been deleted
                        //if (i === 0) {
                            try {
                                await new Party(guild, party.type, party.leaderID, party.creationChannelID, party.parentID, party.voiceID, party.textID, party.mode, party.limit, client).deleteParty(client)
                            } catch {}
                        //}
                    }
                    if (guild.channels.cache.get(party.voiceID)) {
                        parties.push(new Party(guild, party.type, party.leaderID, party.creationChannelID, party.parentID, party.voiceID, party.textID, party.mode, party.limit, client))
                    }
                } catch (err) {
                    console.log(err)
                }
            })

            if (i === 0) {
                guildProfile.setupInProgress = false
            }
            if (!guildProfile.botUpdateChannelID) guildProfile.botUpdateChannelID = null
            //Add recreated guild profile class to the list.
            client.guildProfileList.push(new GuildProfile(guildProfile.guildID, guildProfile.settings, creationChannels, parties, guildProfile.commandToggles, guildProfile.setupInProgress, guildProfile.botUpdateChannelID))

        }
    })
    i ++

    //Update local storage
    //if (i % 100 === 0) {
        localStorage.setItem('GuildProfileList', JSON.stringify(client.guildProfileList))
        localStorage.setItem('GuildCount', JSON.stringify(client.guildProfileList.length))
    //}
}

module.exports = reload

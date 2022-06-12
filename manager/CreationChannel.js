const Discord = require('discord.js')
const Party = require('./Party.js')
const reload = require('./Reload.js')

/**
 * Class to create instances for each creation channel within a guild.
 */
class CreationChannel{
    //constructor   
    /**
     * Constructs the Creation Channel.
     * @param {*} guildID 
     * @param {*} type 
     * @param {*} channel 
     * @param {*} parentChannel 
     */
    constructor(guildID, type, creationChannelID, parentChannelID, limit, defaultMode) {
        this.guildID = guildID
        this.type = type
        this.creationChannelID = creationChannelID
        this.parentChannelID = parentChannelID
        this.limit = limit
        this.defaultMode = defaultMode
    }

    //methods

    /**
     * Get guildID.
     * @returns this.guildID
     */
    getGuildID() {
        return this.guildID
    }

    /**
     * Get type.
     * @returns this.type
     */
    getType() { 
        return this.type
    }

    /**
     * Get creationChannelID.
     * @returns thiis.creationChannelID
     */
    getCreationChannelID() {
        return this.creationChannelID
    }

    /**
     * Get parentChannelID.
     * @returns this.parentChannelID
     */
    getParentChannelID() {
        return this.parentChannelID
    }

    /**
     * Sets the creation channel type.
     * @param {String} type 
     */
    setType(type){
        this.type = type
    }

    /**
     * New parent category
     */
     async newParent(guild, type, client) {
        await guild.channels.create(`${type} Parties`, { 
            type: 'category',
            position: guild.channels.cache.get(this.creationChannelID).parent !== null ? guild.channels.cache.get(this.creationChannelID).parent.rawPosition + 1:null,
            permissionOverwrites: [

            ],
        }).then(channel => {
            this.parentChannelID = channel.id
        })
    }

    /**
     * Creates party after antispam delay.
     * @param {String} type 
     * @param {Object} leader 
     * @param {Object} creationChannel 
     * @param {Object} guild 
     * @param {Object} client 
     */
    async createParty(type, leader, creationChannel, guild, client) {

        let count = JSON.parse(localStorage.getItem('PartiesCreated'))
        count ++
        localStorage.setItem('PartiesCreated', count)

        if (await guild.channels.cache.get(this.parentChannelID) === undefined)
                    this.newParent(guild, type, client)
        setTimeout(async () => {
            try {
                if (guild.members.cache.get(leader.id).voice.channel.id !== creationChannel.getCreationChannelID()) 
                    return                
                switch(type) {
                    // case 'unified':
                    //     this.createUnifiedParty(leader, guild, client)
                    //     break

                    case 'Voice & Text':
                        this.createVoiceAndTextParty(leader, guild, client)
                        break

                    case 'Voice':
                        this.createVoiceParty(leader, guild, client)
                        break
                }
            } catch (e) { 
                //console.log(e) 
            }
        }, 4000)
    }


    
        /**
         * Creates a VoiceAndText party for the user that joins this creation channel.
         * @param {Object} leader 
         * @param {Object} creationChannel 
         * @param {Object} guild 
         * @param {Object} client 
         */
        async createVoiceAndTextParty(leader, guild, client) {
            console.log(this.defaultMode)
            if (this.defaultMode === 'private') {
                await guild.channels.create(`${leader.user.username}'s Party Voice`, {
                    type: 'voice',
                    parent: this.parentChannelID,
                    position: null,
                    permissionOverwrites: [{
                        id: guild.roles.everyone,
                        deny: ['CONNECT', 'SPEAK']
                    },{
                        id: client.user.id,
                        allow: ['CONNECT', 'SPEAK']
                    },{
                        id: leader.user.id,
                        allow: ['CONNECT', 'SPEAK']
                    }]
                }).then(async channel => {
                    let voice = channel
                    await guild.channels.create(`${leader.user.username}'s Party Text`, {
                        type: 'text',
                        parent: this.parentChannelID,
                        position: null,
                        permissionOverwrites: [{
                            id: guild.roles.everyone,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },{
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },{
                            id: leader.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        }],
                    }).then(async channel => {
                        let text = channel
                        //create party class
                        client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === guild.id)].parties.push(new Party(guild, this.type, leader.id, this.creationChannelID, null, voice.id, text.id, this.defaultMode, this.limit, client))
                        if (leader.voice.channel !== null) {
                            await leader.voice.setChannel(voice)
                        } else {
                            client.Util.getPartyProfile(guild.id, voice.id, client).deleteParty(client)
                        }
                    })
                })
            } else {
                await guild.channels.create(`${leader.user.username}'s Party Voice`, {
                    type: 'voice',
                    parent: this.parentChannelID,
                    position: null,
                    permissionOverwrites: [{
                        id: guild.roles.everyone,
                        allow: ['CONNECT', 'SPEAK']
                    },{
                        id: client.user.id,
                        allow: ['CONNECT', 'SPEAK']
                    },{
                        id: leader.user.id,
                        allow: ['CONNECT', 'SPEAK']
                    }]
                }).then(async channel => {
                    let voice = channel
                    await guild.channels.create(`${leader.user.username}'s Party Text`, {
                        type: 'text',
                        parent: this.parentChannelID,
                        position: null,
                        permissionOverwrites: [{
                            id: guild.roles.everyone,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },{
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },{
                            id: leader.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        }],
                    }).then(async channel => {
                        let text = channel
                        //create party class
                        client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === guild.id)].parties.push(new Party(guild, this.type, leader.id, this.creationChannelID, null, voice.id, text.id, this.defaultMode, this.limit, client))
                        if (leader.voice.channel !== null) {
                            await leader.voice.setChannel(voice)
                        } else {
                            client.Util.getPartyProfile(guild.id, voice.id, client).deleteParty(client)
                        }
                    })
                })
            }
        }
        
        /**
         * Creates a voice party for the user that joins this creation channel.
         * @param {Object} leader 
         * @param {Object} creationChannel 
         * @param {Object} guild 
         * @param {Object} client 
         */
        async createVoiceParty(leader, guild, client) {
            if (this.defaultMode === 'private') {
                await guild.channels.create(`${leader.user.username}'s Party Voice`, {
                    type: 'voice',
                    parent: this.parentChannelID,
                    position: null,
                    permissionOverwrites: [{
                        id: guild.roles.everyone,
                        deny: ['CONNECT', 'SPEAK']
                    },{
                        id: client.user.id,
                        allow: ['CONNECT', 'SPEAK']
                    },{
                        id: leader.user.id,
                        allow: ['CONNECT', 'SPEAK']
                    }],
                }).then(async channel => {
                    let voice = channel
                    //create party class
                    client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === guild.id)].parties.push(new Party(guild, this.type, leader.id, this.creationChannel, null, voice.id, null, this.defaultMode, this.limit, client))
                    if (leader.voice.channel !== null) {
                        await leader.voice.setChannel(voice)
                    } else {
                        client.Util.getPartyProfile(guild.id, voice.id, client).deleteParty()
                    }
                })
            } else {
                await guild.channels.create(`${leader.user.username}'s Party Voice`, {
                    type: 'voice',
                    parent: this.parentChannelID,
                    position: null,
                    permissionOverwrites: [{
                        id: guild.roles.everyone,
                        allow: ['CONNECT', 'SPEAK']
                    },{
                        id: client.user.id,
                        allow: ['CONNECT', 'SPEAK']
                    },{
                        id: leader.user.id,
                        allow: ['CONNECT', 'SPEAK']
                    }],
                }).then(async channel => {
                    let voice = channel
                    //create party class
                    client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === guild.id)].parties.push(new Party(guild, this.type, leader.id, this.creationChannel, null, voice.id, null, this.defaultMode, this.limit, client))
                    if (leader.voice.channel !== null) {
                        await leader.voice.setChannel(voice)
                    } else {
                        client.Util.getPartyProfile(guild.id, voice.id, client).deleteParty()
                    }
                })
            }
        }

        setLimit(client, limit) {
            this.limit = limit
        }

        setDefaultMode(client, defaultMode) {
            this.defaultMode = defaultMode
        }
    


}

module.exports = CreationChannel
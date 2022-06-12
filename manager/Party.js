const Discord = require('discord.js')
/**
 * Class to create an instance of each party within a guild.
 */
class Party {
    //constructor
    /**
     * Constructor for party class.
     * @param {String} guildID - The guild id of the party.
     * @param {String} type - The type of party.
     * @param {Object} leaderID - The member that created the party.
     * @param {Object} creationChannelID - The channel that created the party.
     * @param {Object} parentID - The parent of the party.
     * @param {Object} voiceID - The voice channel of the party.
     * @param {Object} textID - The text channel of the party.
     * @param {String} mode - The privacy mode of the party.
     */
    constructor(guild, type, leaderID, creationChannelID, parentID, voiceID, textID, mode, limit, client) {
        this.guildID = guild.id
        this.type = type
        this.leaderID = leaderID
        this.creationChannelID = creationChannelID
        this.parentID = parentID
        this.voiceID = voiceID
        this.textID = textID
        this.limit = limit
        this.createdAtMS = guild.channels.cache.get(this.voiceID).createdTimestamp
        this.mode = mode

        this.setLimit(client, this.limit)
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
     * Get leaderID.
     * @returns this.leaderID
     */
    getLeaderID() {
        return this.leaderID
    }

    /**
     * Get creationChannelID.
     * @returns this.creationChannelID
     */
    getCreationChannelID() {
        return this.creationChannelID
    }

    /**
     * Get parentID.
     * @returns this.parentID
     */
    getParentID() {
        return this.parentID
    }

    /**
     * Get voiceID.
     * @returns this.voiceID
     */
    getVoiceID() {
        return this.voiceID
    }

    /**
     * Get textID.
     * @returns this.textID
     */
    getTextID() {
        return this.textID
    }

    /**
     * Get creation ms.
     * @returns this.createdAtMS
     */
    getCreatedAtMS() {
        return this.createdAtMS
    }

    /**
     * Get mode.
     * @returns this.mode
     */
    getMode() {
        return this.mode
    }
    /**
         * Kicks member from the party.
         * @param {Object} client 
         * @param {String} userID 
         */
    kickMember(client, userID) {
        client.guilds.cache.get(this.guildID).members.cache.get(userID).voice.setChannel(null)
    }

    /**
     * Adds member to party.
     * @param {Object} client 
     * @param {String} userID 
     */
    addMember(client, userID) {
        if (this.voiceID !== null)
            client.guilds.cache.get(this.guildID).channels.cache.get(this.voiceID).updateOverwrite(client.guilds.cache.get(this.guildID).members.cache.get(userID), {
                CONNECT: true,
                SPEAK: true
            })
            
        if (this.textID !== null)
            client.guilds.cache.get(this.guildID).channels.cache.get(this.textID).updateOverwrite(client.guilds.cache.get(this.guildID).members.cache.get(userID), {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            })
    }

    /**
     * 
     * @param {Object} client 
     * @param {String} userID 
     */
    setNeutral(client, userID) {
        if (this.voiceID !== null)
            client.guilds.cache.get(this.guildID).channels.cache.get(this.voiceID).updateOverwrite(client.guilds.cache.get(this.guildID).members.cache.get(userID), {
                CONNECT: null,
                SPEAK: null
            })
            
        if (this.textID !== null)
            client.guilds.cache.get(this.guildID).channels.cache.get(this.textID).updateOverwrite(client.guilds.cache.get(this.guildID).members.cache.get(userID), {
                SEND_MESSAGES: null,
                VIEW_CHANNEL: null
            })
    }

    /**
     * Removes member from the party.
     * @param {Object} client 
     * @param {String} userID 
     */
    removeMember(client, userID) {
        if (this.voiceID !== null)
            client.guilds.cache.get(this.guildID).channels.cache.get(this.voiceID).updateOverwrite(client.guilds.cache.get(this.guildID).members.cache.get(userID), {
                CONNECT: false,
                SPEAK: false
            })
        
        if (this.textID !== null)
            client.guilds.cache.get(this.guildID).channels.cache.get(this.textID).updateOverwrite(client.guilds.cache.get(this.guildID).members.cache.get(userID), {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            })
        
        this.kickMember(client, userID)
    }


    /**
     * Sets mode to public.
     * @param {Object} client 
     */
    setPublic(client) {
        this.mode = "public"
        
        if (this.voiceID !== null)    
            client.guilds.cache.get(this.guildID).channels.cache.get(this.voiceID).updateOverwrite(client.guilds.cache.get(this.guildID).roles.everyone, {
                CONNECT: true,
                SPEAK: true
            })

        if (this.textID !== null)
            try {
                client.guilds.cache.get(this.guildID).channels.cache.get(this.textID).updateOverwrite(client.guilds.cache.get(this.guildID).roles.everyone, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true
                })
            } catch {}
        }

    /**
     * Sets mode to private.
     * @param {Object} client 
     */
    setPrivate(client) {
        this.mode = "private"

        if (this.voiceID !== null)    
            client.guilds.cache.get(this.guildID).channels.cache.get(this.voiceID).updateOverwrite(client.guilds.cache.get(this.guildID).roles.everyone, {
                CONNECT: false,
                SPEAK: false
            })

        if (this.textID !== null)
            client.guilds.cache.get(this.guildID).channels.cache.get(this.textID).updateOverwrite(client.guilds.cache.get(this.guildID).roles.everyone, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            })
    }

    /**
     * Deletes the party.
     * @param {Object} client 
     */
    async deleteParty(client) {
        console.log('Deleting party.')
        let guild = client.guilds.cache.get(this.guildID)

        if (this.voiceID !== null) try { await guild.channels.cache.get(this.voiceID).delete() } catch {}
        
        if (this.textID !== null) try { await guild.channels.cache.get(this.textID).delete() } catch {}
    
        if (this.parentID !== null) try { await guild.channels.cache.get(this.parentID).delete() } catch {}
        
        if (client.guilds.cache.get(this.guildID).channels.cache.get(this.voiceID)) {
            
        }

    }

    /**
     * Sets the leader of the party.
     * @param {String} userID 
     * @param {Object} client 
     */
    setLeader(client, userID) {
        this.leaderID = userID
    }

    setLimit(client, limit) {
        client.guilds.cache.get(this.guildID).channels.cache.get(this.voiceID).setUserLimit(limit)
        this.limit = limit
    }

    

}
module.exports = Party
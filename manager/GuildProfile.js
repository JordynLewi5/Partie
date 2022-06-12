const Discord = require('discord.js')
/**
 * This class creates instances of each guild and their properties.
 */
class GuildProfile {
    //constructor
    /**
     * Constructs the new instance of Guild class. 
     * @param {Object} guild
     * @param {String} settings 
     * @param {array} creationChannels
     * @param {array} parties
     */
    constructor(guildID, settings, creationChannels, parties, commandToggles, setupInProgress, botUpdateChannelID) {
        this.guildID = guildID
        this.settings = settings
        this.creationChannels = creationChannels
        this.parties = parties
        this.commandToggles = commandToggles
        this.setupInProgress = setupInProgress
        this.botUpdateChannelID = botUpdateChannelID
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
     * Get settings.
     * @returns this.settings
     */
    getSettings() {
        return this.settings
    }

    /**
     * Get creationChannels.
     * @returns this.creationChannels
     */
    getCreationChannels() {
        return this.creationChannels
    }

    /**
     * Get parties.
     * @returns this.parties
     */
    getParties() {
        return this.parties
    }

    /**
     * Get commandToggles.
     * @returns this.commandToggles
     */
    getCommandToggles() {
        return this.commandToggles
    }

    /**
     * Sets the bot update channel.
     * @param {String} channelID 
     */
    setBotUpdateChannel(channelID) {
        this.botUpdateChannelID = channelID
    }
}
module.exports = GuildProfile
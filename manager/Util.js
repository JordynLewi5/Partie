/**
 * Gets the guild profile.
 * @param {String} guildID 
 * @param {Object} client 
 * @returns guildProfile
 */
function getGuildProfile(guildID, client) {
    let guildProfile = client.guildProfileList[client.guildProfileList.findIndex(guildProfile => guildProfile.guildID === guildID)]
    return guildProfile
}

/**
 * Gets the party profile.
 * @param {String} guildID 
 * @param {String} voiceID 
 * @param {Object} client 
 * @returns partyProfile
 */
function getPartyProfile(guildID, voiceID, client) {
    console.log(guildID, voiceID)
    let guildProfile = getGuildProfile(guildID, client)
    let partyProfile = guildProfile.parties[guildProfile.parties.findIndex(partyProfile => partyProfile.voiceID === voiceID)]
    return partyProfile
}

/**
 * Gets the creation channel profile.
 * @param {String} guildID 
 * @param {String} voiceID 
 * @param {Object} client 
 * @returns creationChannelProfile
 */
function getCreationChannelProfile(guildID, voiceID, client) {
    let guildProfile = getGuildProfile(guildID, client)
    let creationChannelProfile = guildProfile.creationChannels[guildProfile.creationChannels.findIndex(creationChannel => creationChannel.creationChannelID === voiceID)]
    return creationChannelProfile
}

/**
 * Gets the number of parties in a guild.
 * @param {String} guildID 
 * @param {Object} client 
 * @returns 
 */
function getNumberOfPartiesInGuild(guildID, client) {
    let guildProfile = getGuildProfile(guildID, client)
    let num = guildProfile.parties.length
    return num
}

/**
 * Gets the number of creation channels in a guild.
 * @param {String} guildID 
 * @param {Object} client 
 * @returns 
 */
 function getNumberOfCCInGuild(guildID, client) {
    let guildProfile = getGuildProfile(guildID, client)
    let num = guildProfile.creationChannels.length
    return num
}

module.exports = {
    getGuildProfile, 
    getPartyProfile, 
    getCreationChannelProfile,
    getNumberOfPartiesInGuild,
    getNumberOfCCInGuild
}
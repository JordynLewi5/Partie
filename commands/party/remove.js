const Util = require('../../manager/Util.js')

remove = {
    name: 'remove',
    description: 'Removes a user from the party.',
    parameters: '<@mention>',
    requirement: 'leader',
    execute (Discord, client, message, args, prefix) {
        client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).removeMember(client, message.mentions.users.first().id)
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Successfully removed member.`)
        .setDescription(`Removed \`${client, message.mentions.users.first().username}\` from the party.`)
        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
    }
}
module.exports = remove
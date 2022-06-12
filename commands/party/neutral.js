neutral = {
    name: 'neutral',
    description: 'Resets a user\'s permissions for the party.',
    parameters: '<@mention>',
    requirement: 'leader',
    execute (Discord, client, message, args, prefix) {
        client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).setNeutral(client, message.mentions.users.first().id)
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Successfully reset member permissions.`)
        .setDescription(`Reset \`${client, message.mentions.users.first().username}\`'s party permissions.`)
        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
    }
}
module.exports = neutral
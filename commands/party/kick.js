kick = {
    name: 'kick',
    description: 'Kick a user from your party',
    parameters: '<@mention>',
    requirement: 'leader',
    execute (Discord, client, message, args, prefix) {
        try {
            client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).kickMember(client, message.mentions.users.first().id)
            message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Successfully kicked member.`)
            .setDescription(`Kicked \`${client, message.mentions.users.first().username}\` from the party.`)
            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
        } catch {
            client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).kickMember(client, message.mentions.users.first().id)
            message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Unable to kick member.`)
            .setDescription(`Make sure they are in your party.`)
            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
        }
    }
}
module.exports = kick
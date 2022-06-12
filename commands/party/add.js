add = {
    name: 'add',
    description: 'Add a user to your party.',
    parameters: '<@mention>',
    requirement: 'leader',
    execute (Discord, client, message, args) {
        client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).addMember(client, message.mentions.users.first().id)
        message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Successfully added member.`)
        .setDescription(`Added \`${client, message.mentions.users.first().username}\` to the party.`)
        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
    }
}
module.exports = add
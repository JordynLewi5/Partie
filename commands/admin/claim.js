claim = {
    name: 'claim',
    description: 'Claim party leadership if you are in the party voice channel.',
    parameters: '',
    requirement: 'admin',
    execute (Discord, client, message) {
        try {
            client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).setLeader(client, message.author.id)
            message.channel.send(new Discord.MessageEmbed()
            .setTitle('Successfully claimed party.')
            .setDescription(`${message.member} is now the leader of this party.`)
            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
            
        } catch {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle("Can't find party to claim.")
                .setDescription("You must be in a party voice channel to claim.")
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
        }
    }
}
module.exports = claim
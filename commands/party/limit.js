limit = {
    name: 'limit',
    description: 'Limit the number of users allowed in the party.',
    parameters: '<#>',
    requirement: 'leader',
    execute (Discord, client, message, args, prefix) {
        if (args[1]) {
            if (args[1] === 'none') {
                client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).setLimit(client, null)
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('Successfully set voice channel user limit.')
                    .setDescription(`Set voice channel user limit to \`none\`.`)
                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
            } else if (parseInt(args[1]) > 0 && (parseInt(args[1]) < 100)){
                client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).setLimit(client, parseInt(args[1]))
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('Successfully set voice channel user limit.')
                    .setDescription(`Set voice channel user limit to \`${parseInt(args[1])}\`.`)
                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle('Invalid value provided.')
                    .setDescription('Value must be a number greater than `0` and less than `100` or `none`.')
                    .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
            }
        } else {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('Invalid value provided.')
                .setDescription('Value must be a number greater than `0` and less than `100` or `none`.')
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
        }
    }
}
module.exports = limit
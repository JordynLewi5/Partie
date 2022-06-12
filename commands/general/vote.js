vote = {
    name: 'vote',
    description: 'Get the link to the vote page.',
    parameters: '',
    requirement: 'none',
    execute(Discord, client, message, args, prefix) {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle('Vote for Partie!')
        .setDescription('Vote for Partie on top.gg by clicking [here](https://top.gg/bot/817608521679896586/vote). Voting really helps ')
        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
    }
}

module.exports = vote

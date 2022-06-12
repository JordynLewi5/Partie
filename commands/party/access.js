access = {
    name: 'access',
    description: 'Shows who has access to your current party.',
    parameters: '',
    requirement: 'leader',
    async execute (Discord, client, message) {

        let countAllow = 0;
        let countDeny = 0;
        let partyMembersAllow = [];
        let partyMembersDeny = [];
        await message.member.voice.channel.permissionOverwrites.map(member => {
            //check if member has permissions to access party
            if(member.allow.bitfield > 0 && member.type === 'member') {
                partyMembersAllow.push(message.guild.members.cache.get(member.id));
                countAllow ++;
            }
            //check if member does not have permissions to access party
            if(member.deny.bitfield > 0 && member.type === 'member') {
                partyMembersDeny.push(message.guild.members.cache.get(member.id));
                countDeny ++;
            }
            
        });
        await message.channel.send(new Discord.MessageEmbed()
        .setTitle(`Party Access`)
        .setDescription(`
        Your party is currently \`${client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).getMode()}\`.

        Added Members: ${partyMembersAllow.join(', ')}
        Added count: ${countAllow}
        
        Removed Members: ${partyMembersDeny.join(', ')}
        Removed count: ${countDeny}

        Party Leader: ${message.guild.members.cache.find(member => member.id === client.Util.getPartyProfile(message.guild.id, message.member.voice.channel.id, client).leaderID)}
        `)
        .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png'))
    }
}
module.exports = access
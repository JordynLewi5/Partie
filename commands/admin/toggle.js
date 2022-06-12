
/**
 * Toggle command.
 */
 toggle = {
    name: 'toggle',
    description: 'Toggle commands on or off for your server.',
    parameters: '<command name>',
    requirement: 'admin',
    async execute (Discord, client, message, args, prefix) {
        let list = ''
        let commands = []
        Array.from(client.commands).forEach(command => {
            if (command[1].requirement === 'leader') {
                list += `\`${command[0]}\` ▸ ${client.Util.getGuildProfile(message.guild.id, client).commandToggles[client.Util.getGuildProfile(message.guild.id, client).commandToggles.findIndex(commandToggle => commandToggle.name === command[0])].toggle?'<:enabled:882359051885883422>':'<:disabled:882359051839758416>'}\n`
                commands.push(command[0])
            }
        })

        if (!commands.includes(args[1])){
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Please provide a valid command to toggle.`)
                .setDescription(`**Togglable commands:** 
                ${list}`)
                .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
            )
        }

        //toggle command
        if (client.Util.getGuildProfile(message.guild.id, client).commandToggles[client.Util.getGuildProfile(message.guild.id, client).commandToggles.findIndex(commandToggle => commandToggle.name === args[1])].toggle) {
            client.Util.getGuildProfile(message.guild.id, client)
            .commandToggles[client.Util.getGuildProfile(message.guild.id, client)
            .commandToggles.findIndex(commandToggle => commandToggle.name === args[1])].toggle = false
        } else {
            client.Util.getGuildProfile(message.guild.id, client)
            .commandToggles[client.Util.getGuildProfile(message.guild.id, client)
            .commandToggles.findIndex(commandToggle => commandToggle.name === args[1])].toggle = true
        }

        list = ''
        commands = []
        Array.from(client.commands).forEach(command => {
            if (command[1].requirement === 'leader') {
                list += `\`${command[0]}\` ▸ ${client.Util.getGuildProfile(message.guild.id, client).commandToggles[client.Util.getGuildProfile(message.guild.id, client).commandToggles.findIndex(commandToggle => commandToggle.name === command[0])].toggle?'<:enabled:882359051885883422>':'<:disabled:882359051839758416>'}\n`
                commands.push(command[0])
            }
        })

        //send confirmation message
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Successfully toggled command.`)
            .setDescription(`The command **\`${args[1]}\`** is now ${client.Util.getGuildProfile(message.guild.id, client)
                .commandToggles[client.Util.getGuildProfile(message.guild.id, client)
                .commandToggles.findIndex(commandToggle => commandToggle.name === args[1])].toggle?'**`enabled`**.':'**`disabled`**. However, **server administators** will still be able to use it.'}
                
                **Togglable commands:**
                ${list}`)
            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')

        )

    }
}
module.exports = toggle
help = {
    name: 'help',
    description: 'Sends help menu to channel or pm channel depending on guild settings.',
    parameters: '',
    requirement: 'none',
    async execute (Discord, client, message, args, prefix) {
        try {
            await message.react('<:ping:874339800143003708>')
        } catch {}
        let helpList = ''
        let commandsArray = Array.from(client.commands)
        
        //Only append commands that general users can view
        helpList += `\n**General Commands**\n`
        commandsArray.forEach(command => {
            if (command[0] !== undefined && command[1].requirement == 'none') {
                helpList += `**\`${prefix}${command[1].name} ${command[1].parameters}\`** ${command[1].description}\n`
            }
        })

        //Only append commands that leader users can view
        helpList += `\n**Party Commands**\n`
        commandsArray.forEach(command => {
            if (command[0] !== undefined && command[1].requirement == 'leader') {
                helpList += `**\`${prefix}${command[1].name} ${command[1].parameters}\`** ${command[1].description}\n`
            }
        })
        
        //Append commands that server admins can see
        if (message.member.hasPermission("ADMINISTRATOR")) {
            helpList += `\n**Server Admin Commands**\n`
            commandsArray.forEach(command => {
                if (command[0] !== undefined && command[1].requirement == 'admin') {
                    helpList += `**\`${prefix}${command[1].name} ${command[1].parameters}\`** ${command[1].description}\n`
                }
            })
        }
        //Append commands that only the developer can see
        if (message.member.id == '599075619178807312') {
            helpList += `\n**Bot Developer Commands**\n`
            commandsArray.forEach(command => {
                if (command[0] !== undefined && command[1].requirement == 'developer') {
                    helpList += `**\`${prefix}${command[1].name} ${command[1].parameters}\`** ${command[1].description}\n`
                }
            })
        }

       message.member.send(new Discord.MessageEmbed()
            .setTitle(`Partie Help`)
            .setDescription(`${helpList}

            ${message.member.hasPermission("ADMINISTRATOR")?`**How to begin:** To set up a creation channel simply use \`${prefix}setup\`, and the process will begin with additional instructions! *Note: Only server admins can see this tip.*`:''}

            **Quick Links:**
            **[Support Server](https://discord.gg/H5AFRkSkJ2)** - **[Vote](https://top.gg/bot/817608521679896586/vote)** - **[Invite Me](https://discord.com/api/oauth2/authorize?client_id=817608521679896586&permissions=837824081&scope=bot)**
            
            **If you forget your server prefix you can simply mention \`@Partie\`.**`)
            .setFooter(message.member.hasPermission("ADMINISTRATOR")?`Note: Only server admins will be able to see this message and the admin commands.`:'')
            .setColor('#78acff').setAuthor('Partie', 'http://www.simpleimageresizer.com/_uploads/photos/e214e548/logo_25.png')
        )
    }
}

module.exports = help
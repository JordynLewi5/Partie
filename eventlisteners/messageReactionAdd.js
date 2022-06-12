const Discord = require('discord.js')
let tickets = []
async function reaction(client, config) {
    client.on('messageReactionAdd', async (reaction, user) => {

        let CANCEL_BUTTON = new client.disbut.MessageButton()
        .setStyle('grey')
        .setLabel('Cancel')
        .setID('cancel')
        
        switch (reaction.message.id) {

            //suggestions ticket for support server
            case '870112006622027836':
                reaction.message.reactions.resolve(reaction.emoji.name).users.remove(user);
                    
                if (tickets.findIndex(ticket => ticket.userID === user.id) !== -1) return

                tickets.push({
                    userID: user.id,
                    ticket: 'suggestions'
                })

                await reaction.message.guild.channels.create(`🐛 ${user.username}'s Ticket`, {
                    type: 'text',
                    parent: '870102988407078984',
                    permissionOverwrites: [
                        {
                            id: reaction.message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
                        }, 
                        {
                            id: user.id,
                            allow: ['VIEW_CHANNEL']
                        }]
                    }).then(channel => {
                        channel.send({
                            embed: new Discord.MessageEmbed()
                            .setDescription('In a **single** message please explain the bug you found and a way to reproduce this bug to your best knowledge. You\'ll have 5 minutes to send your response before this ticket is closed.'),
                            buttons: [CANCEL_BUTTON]
                        }).then(bugPrompt => {
                            bugPrompt.awaitButtons(button => button.clicker.user.id === user.id, {
                                max: 1,
                                time: 200000
                            }).then(async buttons => {
                                try {
                                    await channel.delete()
                                } catch {}                       
                                tickets.splice(tickets.findIndex(ticket => ticket.userID === user.id), 1)
                            })

                            channel.awaitMessages(message => message.author.id === user.id, {
                                max: 1,
                                time: 200000
                            }).then(async responses => {
                                if (!responses.first()) return
                                let bugLog = await channel.guild.channels.cache.get('872671581611110420')
                                await bugLog.send(new Discord.MessageEmbed()
                                .setDescription(`${responses.first().member}: ${responses.first().content}`))

                                try {
                                    await channel.delete()
                                } catch {}

                                tickets.splice(tickets.findIndex(ticket => ticket.userID === user.id), 1)
                            })
                        })
                    })
                break

            //bug report ticket for support server
            case '870113479338643547':
                

                reaction.message.reactions.resolve(reaction.emoji.name).users.remove(user);
                
                if (tickets.findIndex(ticket => ticket.userID === user.id) !== -1) return
                tickets.push({
                    userID: user.id,
                    ticket: 'bug'
                })
                await reaction.message.guild.channels.create(`📜 ${user.username}'s Ticket`, {
                    type: 'text',
                    parent: '870102988407078984',
                    permissionOverwrites: [
                        {
                            id: reaction.message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
                        }, 
                        {
                            id: user.id,
                            allow: ['VIEW_CHANNEL']
                        }]
                    }).then(channel => {
                        
                        channel.send({
                            embed: new Discord.MessageEmbed()
                            .setDescription('In a **single** message please write out your suggestion! You\'ll have 5 minutes to send your response before this ticket is closed.'),
                            buttons: [CANCEL_BUTTON]
                        }).then(suggestionPrompt => {
                            
                            suggestionPrompt.awaitButtons(button => button.clicker.user.id === user.id, {
                                max: 1,
                                time: 200000
                            }).then(async buttons => {
                            
                                try {
                                    await channel.delete()
                                } catch {}                                
                                tickets.splice(tickets.findIndex(ticket => ticket.userID === user.id), 1)
                                
                            })
                            channel.awaitMessages(message => message.author.id === user.id, {
                                max: 1,
                                time: 200000
                            }).then(async responses => {
                                if (!responses.first()) return

                                let suggestionLog = channel.guild.channels.cache.get('872671684489007144')
                                await suggestionLog.send(new Discord.MessageEmbed()
                                .setDescription(`${responses.first().member}: ${responses.first().content}`))
                                try {
                                    await channel.delete()
                                } catch {}
                                tickets.splice(tickets.findIndex(ticket => ticket.userID === user.id), 1)
                            })
                        })
                    })
                break

            
        }
    })
}

module.exports = reaction
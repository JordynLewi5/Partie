const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client({
  partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION'],
 })
require('discord-buttons')(client)
const disbut = require("discord-buttons");
client.disbut = disbut
const Util = require('./manager/Util.js')
client.Util = Util
const fs = require('fs')
client.commands = new Discord.Collection()
const commandFolders = fs.readdirSync('./commands/').filter(file => !file.includes('.'))

commandFolders.forEach(folder => {
  fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')).forEach(file => {
    const command = require(`./commands/${folder}/${file}`)
    client.commands.set(command.name, command)  
  })
})

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage('./scratch')
}

client.guildProfileList = []


const guildCreate = require('./eventlisteners/guildCreate.js')
const message = require('./eventlisteners/message.js')
const reload = require('./manager/Reload.js')
const voiceStateUpdate = require('./eventlisteners/voiceState.js')
const reaction = require('./eventlisteners/messageReactionAdd.js')
const topgg = require('./eventlisteners/topgg.js')
const clickButton = require('./eventlisteners/clickButton.js')

// const { AutoPoster } = require('topgg-autoposter')

// const ap = AutoPoster(config.topggToken, client)

// ap.on('posted', () => {
//   console.log('Posted stats to Top.gg!')
// })


client.on("ready", async (user) => {
  console.log(`${client.user.tag} is online!`)
  client.user.setPresence({
    activity:{
      type: "LISTENING", 
      name: `p!help`
    }
  })


  // client.on("raw", packet => {
  //   if (!packet.d.author.bot) console.log(packet.d)
  // })
  
  reload(client)
  message(client, config)
  guildCreate(client, config)
  voiceStateUpdate(client, config)
  reaction(client, config)

  clickButton(client, config)
  
  setInterval(() => {
    reload(client)
  }, 6000)

  let presenceNum = 0
  setInterval(() => {
    if (presenceNum == 0) {
      client.user.setPresence({
        activity:{
          type: "LISTENING", 
          name: `p!help`
        }
      })
      presenceNum = 1
    } else {
      client.user.setPresence({
        activity:{
          type: "LISTENING", 
          name: `p!invite`
        }
      })
      presenceNum  = 0
    }
  }, 600000)

  client.guilds.cache.get('862894503365705738').channels.cache.get('875097436610252830').setName(`Server Count: ${client.guilds.cache.size}`)
  let totalUsers = 0
    client.guilds.cache.forEach(guild => {
      totalUsers += guild.memberCount
      console.log(guild.name, guild.memberCount)
    })
    client.guilds.cache.get('862894503365705738').channels.cache.get('875553408768163891').setName(`Total Users: ${totalUsers}`)
  setInterval(() => {
    client.guilds.cache.get('862894503365705738').channels.cache.get('875097436610252830').setName(`Server Count: ${client.guilds.cache.size}`)
    
    totalUsers = 0
    client.guilds.cache.forEach(guild => {
      totalUsers += guild.memberCount
    })
    client.guilds.cache.get('862894503365705738').channels.cache.get('875553408768163891').setName(`Total Users: ${totalUsers}`)
    topgg(client, config)
  }, 600000)
})



client.login(config.token[1])




const patreon = require('patreon')
const patreonAPIClient = patreon.patreon(config.patreon[1].accessToken)
setInterval(() => {
  // patreonAPIClient('/current_user/campaigns').then(({ store }) => {
  //   // console.log(store.findAll('campaign'))
  // })
}, 10000)


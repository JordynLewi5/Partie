const { AutoPoster } = require('topgg-autoposter')

function topgg(client, config, Discord) {

    const poster = AutoPoster(config.topgg.token, client) // your discord.js or eris client

    // optional
    // poster.on('posted', (stats) => { // ran when succesfully posted
    // // console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
    // })
    



}

module.exports = topgg
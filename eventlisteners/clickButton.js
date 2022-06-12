const { MessageButtonStyles } = require("discord-buttons")

/**
 * Detect when button is clicked.
 * @param {*} client 
 * @param {*} config 
 */
 function clickButton(client) {
    //message event listener
    client.on('clickButton', async button => {
    })
 }

 module.exports = clickButton
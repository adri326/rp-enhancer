module.exports = (context) => {
  if (/\d{18}/.exec(context.args[1])) {
    client.createMessage(context.channel.id, `https://discordapp.com/oauth2/authorize?&client_id=${context.args[1]}&scope=bot&permissions=0`)
  }
  else {
    client.createMessage(context.channel.id, {embed: {
      title: "Add me to your server~",
      description: `https://discordapp.com/oauth2/authorize?&client_id=${client.user.id}&scope=bot&permissions=0`,
      footer: {
        text: `More informations with ${context.prefix}info`
      }
    }});
  }
}

module.exports.display_name = "Invite";
module.exports.description = "Invite me to your server!";
module.exports.usage = "invite";

module.exports = function(context) {
  let embed = {
    author: {
      name: client.user.username + "#" + client.user.discriminator,
      icon_url: client.user.staticAvatarURL
    },
    description: "A light-roleplay reaction-triggering bot, featuring cuteness\n"
      + "\nAuthor: **[sha_dryx](https://shadryx.me/)**"
      + `\n**${get_pics_number()}** pictures`
      + `\n**${client.guilds.size}** guilds`
      + `\n**${client.users.size}** users`
  }
  client.createMessage(context.channel.id, {embed});
}

function get_pics_number() {
  return Object.values(actions).reduce((acc, act) => {
    return acc + Object.values(act.sets).reduce((acc, act) => {
      return acc + act.length;
    }, 0);
  }, 0);
}

module.exports.display_name = "Informations";
module.exports.description = "Prints stats and infos about this bot";
module.exports.usage = "info";

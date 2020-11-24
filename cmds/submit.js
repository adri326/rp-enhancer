const utils = require("../utils");

//const linkregexp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
const linkregexp = /(?:(?:[\w_]+:?:\/\/)|(?:\/\/))?[\w\d_\+~#=]+(?:\.[\w\d_\+~#=]+)+(?:\/[^\s]+)?/;

module.exports = function(context) {
  let embed = {
    title: "Suggestion by " + context.author.username + "#" + context.author.discriminator,
    description: context.args.slice(1).join(" "),
    fields: [],
    author: {
      icon_url: context.author.staticAvatarURL,
      name: context.author.id
    },
    color: utils.get_member_color(context, context.author.id)
  }

  if (context.attachments.length) { // attachments
    context.attachments.forEach((file) => {
      embed.fields.push({
        name: embed.fields.length + ": [" + file.filename + "]",
        value: "`" + file.url + "`"
      });
    });
  }
  else if (context.args.length == 1) { // no message/attachment: error
    client.createMessage(context.channel.id, {embed: {
      title: "Submit: error",
      description: "Invalid usage; you cannot send us an empty suggestion",
      color: utils.error_color(context)
    }});
    return;
  }

  client.createMessage(suggestion_channel, {embed});

  client.createMessage(context.channel.id, {embed: {
    title: "Submit: success!",
    description: "Successfully sent your suggestion, thanks a lot! We might contact you back if we need to (*or feel like it :3*\u2006)",
    color: utils.get_member_color(context, context.author.id)
  }});
}

module.exports.display_name = "Feedback";
module.exports.description = "Submit a request, picture proposal or feedback to the bot's admins (attachments will be sent too)";
module.exports.usage = "submit [message]";

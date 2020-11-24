const Eris = require("eris");
const utils = require("../utils");

module.exports = function guild(context) {
  if (context.channel instanceof Eris.PrivateChannel) {
    client.createMessage(context.channel.id, "Sorry, this command is only available in servers!");
    return;
  }

  let {args} = context;
  let guild = guilds[context.channel.guild.id];

  if (!guild) {
    guild = guilds[context.channel.guild.id] = {
      md_trigger: false
    };
    save();
  }

  if (!args[1]) {
    let embed = {
      title: "Server settings",
      description: "Here you can set a few of your servers settings",
      fields: [
        {
          name: "Global MarkDown triggering (md)",
          value: `Allow the users who have left their MarkDown triggering setting to "auto" to still use the MarkDown recognition feature. Enable or disable it using \`${context.prefix}guild md_trigger on/off\`` +
            `\n\nCurrent: **${guild.md_trigger ? "on" : "off"}**`
        }
      ]
    }
    client.createMessage(context.channel.id, {embed})
  }
  else {
    if (args[1] == "md_trigger" || args[1] == "md") {
      if (!args[2]) {
        client.createMessage(context.channel.id, {embed: {
          title: "Syntax error",
          description: `You need to provide one more argument. See this command's usage with \`${context.prefix}guild\``,
          color: utils.error_color(context)
        }});
        return;
      }
      let value = ["on", "yes", "active", "oui", "ja", "1", "true"].includes(args[2].toLowerCase());
      guild.md_trigger = value;
      client.createMessage(context.channel.id, {embed: {
        title: "Guild settings: success",
        description: `Successfully ${value ? "enabled" : "disabled"} server-wide MarkDown triggering`
      }});
    }
    else {
      client.createMessage(context.channel.id, {embed: {
        title: "Guild settings: error",
        description: `Unknown setting name \`${args[1]}\` - use \`${context.prefix}guild\` to get the available setting names (the ones in parentheses)`,
        color: utils.error_color(context)
      }});
    }
  }
}

module.exports.display_name = "Server settings";
module.exports.description = "Set your guild's settings!";
module.exports.usage = "guild [...]";

const utils = require("../utils");

module.exports = function help(context) {
  let {commands, args, prefix} = context

  let author_color = utils.get_member_color(context, context.author.id)
  let color = author_color || 13477874 // gray
  color = utils.blend(color, 13477874, 0.3)

  if (context.args.length > 1) {
    if (Object.keys(commands).includes(args[1])) {
      let {usage, description, display_name, short_description} = commands[args[1]]
      description = description || short_description
      let embed = {
        title: `Help: ${display_name || args[1]}`,
        description,
        fields: [
          {
            "name": "Usage:",
            "value": context.prefix + usage
          }
        ],
        color
      }
      client.createMessage(context.channel.id, {embed})
    }
  }
  else {
    let cmds = Object.keys(commands)
    let embed = {
      title: "Help",
      description: `These are the available commands, do \`${prefix}help <command>\` to see more info about a particular command`,
      fields: [],
      color
    }
    cmds.forEach(cmd => {
      let value = commands[cmd];
      if (value.invisible) return;
      let description = value.short_description || value.description;
      embed.fields.push({
        name: value.display_name || cmd,
        value: description + "\n" + (value.usage ? "```\n" + context.prefix + value.usage + "```" : "")
      })
    })
    client.createMessage(context.channel.id, {embed})
  }
}

module.exports.display_name = "Help"
module.exports.usage = "help [command]"
module.exports.description = "Lists the available commands or displays informations about a command"

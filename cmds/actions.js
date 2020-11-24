module.exports = context => {
  let {prefix} = context;
  let embed = {
    title: "Available actions",
    description: "These are all the available actions that this bot features; you can use them through their command or, if you have enabled it in your settings, using the markdown syntax\n\n" +
      Object.entries(actions).map(([key, action]) => {
        if (!action.visible) return;
        return `- \`${prefix}${key}\`` + (action.desc ? ": " + action.desc : "")
      }).filter(Boolean).join("\n")
  }
  client.createMessage(context.channel.id, {embed});
}

module.exports.display_name = "Actions";
module.exports.description = "Displays all the available actions, with their respective syntax";
module.exports.usage = "actions";

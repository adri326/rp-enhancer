const fs = require("fs");

const available_sets = {
  "anime": "Anime",
  "anime_gif": "Anime gif",
  "furry": "Furry"
}

const invisible_char = "\uD82F\uDCA1";

module.exports = context => {
  let {args, prefix} = context;
  let user = users[context.author.id];
  if (!user) {
    user = {
      sets: ["anime", "anime_gif"],
      md_trigger: -1,
      lang: "en"
    };
    users[context.author.id] = user;
    save();
  }
  if (!args[1]) { // available settings
    let embed = {
      title: "Settings",
      description: `These are the available settings, run \`${prefix}settings <setting name> <value>\` to set one of the following settings\n` + invisible_char,
      fields: [
        {
          name: "Sets (sets)",
          value: `The kind of pictures that the bot will send. Enable or disable each one of them using \`${prefix}settings sets <set name> on/off\`\n\n` +
            Object.entries(available_sets).map(([key, value]) => {
              if (user.sets.includes(key)) {
                return `- ${value} (\`${key}\`): **on**`;
              }
              else {
                return `- ${value} (\`${key}\`): **off**`;
              }
            }).join("\n") + "\n" + invisible_char
        },
        {
          name: "MarkDown triggering (md)",
          value: `Wether or not the bot will send pictures if your message contains markdown with actions in it (\`*hug*\` for example). To enable/disable this feature, run \`${prefix}settings md_trigger on/off/auto\`` +
           `\n**\`auto\`** will only trigger this feature in servers that enabled it, while **\`off\`** fully disables it` +
           `\n\nCurrent: **${user.md_trigger == -1 ? "auto" : (user.md_trigger ? "on" : "off")}**`
        }
      ]
    }
    client.createMessage(context.channel.id, {embed})
    return;
  }

  if (args[1] == "sets" || args[1] == "set") {
    if (!args[2] || !args[3]) {
      client.createMessage(context.channel.id, {embed: {
        title: "Available sets:",
        description: Object.entries(available_sets).map(([key, value]) => {
            return `\`${key}\` (${value})`;
          }).join("\n") + `\n\nUse \`${prefix}settings sets <set name> on/off\` to enable/disable a picture set`
      }});
      return;
    }

    if (Object.keys(available_sets).includes(args[2])) {
      let value = ["true", "on", "yes", "oui", "1"].includes(args[3].toLowerCase());
      if (!value && user.sets.includes(args[2])) {
        let i = user.sets.indexOf(args[2]);
        user.sets.splice(i, 1);
      }
      if (value && !user.sets.includes(args[2])) {
        user.sets.push(args[2]);
      }
      let embed = {
        title: "Successfully changed setting",
        description: `Successfully ${value ? "enabled" : "disabled"} the \`${args[2]}\` picture set!`
      }
      save();
      client.createMessage(context.channel.id, {embed});
    }

    else {
      client.createMessage(context.channel.id, {embed: {
        title: "Invalid set name!",
        description: "Set can be one of the following:\n\n" +
          Object.entries(available_sets).map(([key, value]) => {
            return `\`${key}\` (${value})`;
          }).join("\n")
          + `\n\nRun \`${prefix}settings sets <set name> on/off\` with one of the above set identifiers to enable/disable it`
      }});
    }
  }

  if (args[1] == "md_trigger" || args[1] == "md") {
    if (!args[2]) {
      client.createMessage(context.channel.id, {embed: {
        title: "Invalid syntax!",
        description: `The correct syntax is \`${prefix}settings md_trigger on/off\``
      }});
      return;
    }
    let value = !!["true", "on", "yes", "oui", "1"].includes(args[2].toLowerCase());
    if (args[2].toLowerCase() == "auto") {
      value = -1;
    }
    user.md_trigger = value;
    let embed = {
      title: "Successfully changed setting",
      description: `Successfully ${value == -1 ? "\"auto-ed\"" : (value ? "enabled" : "disabled")} MarkDown recognition!`
    }
    save();
    client.createMessage(context.channel.id, {embed});
  }
}

module.exports.display_name = "Settings";
module.exports.usage = "settings [...]";
module.exports.description = "Displays your available settings, their value and allow you to change them. Triggering the command without any arguments will show you all the necessary information";

module.exports.available_sets = available_sets; // ugly

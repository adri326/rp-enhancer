const cmds = {};
const settings = require("./settings");
const fs = require("fs");
const path = require("path");

module.exports = function(context) {
  let user = users[context.author.id];
  if (!user || !user.admin) {
    client.createMessage(context.channel.id, "Sorry, you are not a bot admin!");
    return;
  }
  if (Object.keys(cmds).includes(context.args[1])) {
    cmds[context.args[1]](context, ...context.args.slice(2));
  }
}

module.exports.invisible = true;
module.exports.display_name = "Admin";
module.exports.description = "Admin commands, probably not meant to be used by you, sorry";
module.exports.usage = "admin <command> [args]";

cmds.eval = function(context, code) {
  try {
    let result = eval(code.replace(/^js/, ""));
    client.createMessage(context.channel.id, "```\n" + result + "```");
  }
  catch (e) {
    client.createMessage(context.channel.id, "ERROR```\n" + e + "```");
  }
}

cmds.help = function(context) {
  client.createMessage(context.channel.id, {embed: {
    title: "Admin \"help\"",
    description: "Available commands:\n\n" +
    Object.keys(cmds).map((key) => "- " + key).join("\n")
  }});
}

cmds.push = function(context, _action, set, url, ...credits) {
  if (!url) {
    client.createMessage(context.channel.id, "Usage: " + context.prefix + "admin push <action name> <category> <url> [<source url> [<author>]]");
    return;
  }
  let action = actions[_action];
  if (action) {
    if (Object.keys(action.sets).includes(set)) {
      if (credits.length) {
        action.sets[set].push([url, ...credits]);
      }
      else {
        action.sets[set].push(url);
      }
    }
    else if (Object.keys(settings.available_sets).includes(set)) {
      if (credits.length) {
        action.sets[set] = [
          [url, ...credits]
        ];
      }
      else {
        action.sets[set] = [url];
      }
    }
    else {
      client.createMessage(context.channel.id, "Unkown set `" + set + "`");
      return;
    }
    client.createMessage(context.channel.id, `Successfully added picture \`${url}\` to \`${_action}/${set}\` (${credits.length} credit fields added)`);
    return;
  }
  else {
    client.createMessage(context.channel.id, "Action `" + _action + "` not found!");
  }
}

cmds.see = function(context, actionName, setName) {
  if (actionName) {
    let action = actions[actionName];
    if (!action) {
      client.createMessage(context.channel.id, `No action name ${actionName}`);
      return;
    }
    if (setName) {
      client.createMessage(context.channel.id,
        action.sets[setName].map((picture) => {
          if (Array.isArray(picture)) {
            return "`" + picture.join(" ") + "`";
          }
          else {
            return "`" + picture + "`";
          }
        }).join("\n")
      );
    }
    else { // list sets
      client.createMessage(context.channel.id,
        Object.keys(action.sets).map((key) => {
          let set = action.sets[key];
          return key + ": " + set.length;
        }).join("\n"));
    }
  }
  else { // list actions
    client.createMessage(context.channel.id,
      Object.keys(actions).map((key) => {
        let action = actions[key];
        if (action && action.sets) {
          return key + ": " + Object.values(action.sets).reduce((acc, act) => acc + act.length, 0);
        }
      }).filter(Boolean).join("\n")
    )
  }
}

cmds.save = function(context) {
  fs.writeFileSync(path.join(process.cwd(), "data/actions.json"), JSON.stringify(actions));
  fs.writeFileSync(path.join(process.cwd(), "data/discards.json"), JSON.stringify(discards));
  fs.writeFileSync(path.join(process.cwd(), "data/users.json"), JSON.stringify(users));
  client.createMessage(context.channel.id, "Saved!");
}

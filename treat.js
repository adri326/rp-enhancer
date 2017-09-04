const fs = require("fs");
const CircularJSON = require("circular-json");

function treat(string) {
  var raw = gen_treat_regex().exec(string);
  if (raw !== null) {
    //console.log(raw[2] + " " + (player || player_raw).toString())
    return {
      action: raw[3],
      target: raw[2] || raw[4] || "",
      author: raw[1]
    };
  }
  else {
    return null;
  }
}

function gen_treat_regex() {
  var player_selector = "(?:(?:[\\w_\\-]* ?)|(?:\\<@\\!?\\d{18}\\> ?))+";
  var start_author_selector = "(?:(" + player_selector + ") +[\\-=]\\> )"
  var start_name_selector = "(?:[\\-=]\\> *(" + player_selector + ") )";
  var start_selector = "(?:" + start_author_selector + "|" + start_name_selector + ")?"
  var action_selector = "";
  Object.keys(actions).forEach(name => {
    if (actions[name].match != undefined) {
      action_selector = action_selector + "(?:" + actions[name].match + ")|";
    }
  });
  actions_selector = "(" + action_selector.slice(0, action_selector.length - 1) + ")";
  var kinky_discarder = "(?:[\\~ ❤]*)"
  var full_string = "^ *" + start_selector + actions_selector + " *(" + player_selector + ")?" + kinky_discarder + "$";
  //console.log(full_string);
  return new RegExp(full_string, "i");
}

function find_matching_action(string, target_found) {
  var result = null;

  Object.keys(actions).forEach((name) => {
    if (actions[name].match != undefined) {
      if (new RegExp("^" + actions[name].match + "$").exec(string)) {
        if (actions[name].target_required == 1 && target_found || actions[name].target_required == 0 && !target_found || actions[name].target_required == -1) {
          result = actions[name];
          //console.log(name + ": match");
        }
        else {
          //console.log(name + ": non match");
        }
      }
    }
  });

  return result;
}
function get_nickname(user, guild) {
  if (typeof guild != "undefined") {
    var guild_member = guild.member(user);
    if (guild_member != undefined && guild_member !== null) {
      if (guild_member.nickname !== null) {
        return guild_member.nickname;
      }
      else {
        if (guild_member.user != undefined && guild_member.user !== null)
          return guild_member.user.username;
      }
    }
  }
  if (typeof user != "string") {
    return user.username;
  }
  else {
    return user;
  }
}

function split_args(string) {
  return [].concat
    .apply([], string.split('"')
    .map(function(v,i) {
      return i%2 ?
        v :
        v.split(' ');
    }))
    .filter(Boolean);
}

module.exports = function main(msg) {
  // Checks if there is two or more "*" or "**" in the message's content
  if ((msg.content.match(/\*+/g) || []).length == 2) {
    console.log(msg.author.username + ":" + msg.author.discriminator + "  " + msg.content);
    var treated = treat(msg.content.split(/\*/g)[1]);
    if (treated !== null) {
      var action = find_matching_action(treated.action, treated.target != "");
      treated.last_author = "you";
      if (action !== null) {
        if (action.disp.indexOf("{{last}}") != -1) {
          msg.channel.fetchMessages({limit: 10})
            .then(messages => {
              var found = messages.find(message => message.author.id != msg.author.id && message.author.id != bot.user.id);

              if (found != null) {
                treated.last_author = get_nickname(found.author);
              }

              second(msg, action, treated);
            })
            .catch(console.error);
        }
        else {
          second(msg, action, treated);
        }
      }
    }
  }
  else if (msg.content.startsWith("rp!")) {
    var commands = split_args(msg.content.slice(3));
    if (commands[0] == "invite") {
      msg.channel.send({embed: {
        title: "Invitation link",

        description: "Use this link to add me to a server you can manage: https://discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=0",
        url: "https://discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=0"
      }});
    }
    if (commands[0] == "admin") {
      if (discordadmins.indexOf(msg.author.id) != -1) {
        if (commands[1] == "reload") {
          actions = JSON.parse(fs.readFileSync("./actions.json"));
          msg.channel.send("Reloaded!");
        }
        if (commands[1] == "match") {
          if (commands[2] != undefined) {
            msg.channel.send("```" + (treat(commands[2]) || "Group did not matched") + "```");
          }
          else {
            msg.channel.send("```" + gen_treat_regex().toString() + "```");
          }
        }
        if (commands[1] == "edit") {
          if (commands[2] == undefined) {
            msg.channel.send("```" + Object.keys(actions).toString().replace(/[\[\]\, ]/, "") + "```");
          }
          else {
            if (commands[3] == undefined) {
              if (actions[commands[2]] != undefined) {
                msg.channel.send("```" + CircularJSON.stringify(actions[commands[2]]).replace(/,/g, ",\r\n  ") + "```");
              }
              else {
                msg.channel.send("Object not found!");
              }
            }
            else {
              if (actions[commands[2]] != undefined) {
                if (["match", "disp", "target_required", "parent"].indexOf(commands[3]) > -1) {
                  if (commands[4] == "true") {
                    actions[commands[2]][commands[3]] = true;
                  }
                  else if (commands[4] == "false") {
                    actions[commands[2]][commands[3]] = false;
                  }
                  else {
                    actions[commands[2]][commands[3]] = +commands[4] || commands[4];
                  }
                  msg.channel.send("Set `" + commands[3] + "` to `" + actions[commands[2]][commands[3]] + "`")
                }
                else if (["pics", "sources"].indexOf(commands[3]) > -1) {
                  if (commands[4] == "push") {
                    actions[commands[2]][commands[3]].push(commands[5]);
                    msg.channel.send("Pushed `" + commands[5] + "`");
                  }
                  else if (commands[4] == "pop") {
                    msg.channel.send("Popped `" + actions[commands[2]][commands[3]].pop() + "`");
                  }
                  else if (commands[4] == "splice") {
                    msg.channel.send("Spliced out `" + actions[commands[2]][commands[3]].splice(~~commands[5], 1)[0] + "`");
                  }
                }
                else {
                  msg.channel.send("Property not found!");
                }
              }
              else {
                msg.channel.send("Object not found!");
              }
            }
          }
        }
        if (commands[1] == "add") {
          actions[commands[2]] = {};
          msg.channel.send("Added " + commands[2]);
        }
        if (commands[1] == "save") {
          fs.writeFileSync("./actions.json", CircularJSON.stringify(actions));
        }
      }
    }
  }
}

function second(msg, action, treated) {
  var author = treated.author || get_nickname(msg.author, msg.guild);
  var embed = {
    title: action.disp
      .replace("{{author}}", author)
      .replace("{{target}}", get_nickname(treated.target.replace(/^\<@/, "").replace(/^!/, "").replace(">", ""), msg.guild))
      .replace("{{last}}", treated.last_author),
    color: (msg.guild.member(msg.author) || {displayColor: 13477874}).displayColor
  };
  var actPics = action.pics || [];
  //console.log("pics: " + (action.pics || []).length);
  while ((action || {parent: false}).parent) {
    //console.log("parent: " + action.parent);
    action = actions[action.parent];
    //console.log("pics: " + (action.pics || []).length);
    if (action != undefined) {
      actPics = actPics.concat(action.pics);
    }
  }
  //console.log("total: " + actPics.length);
  if (actPics.length > 0) {
    embed.image = {
      url: actPics[Math.floor(Math.random()*actPics.length)]
    };
    msg.channel.send({embed: embed});
  }
}

function treat(string) {
  var raw = gen_treat_regex().exec(string);
  if (raw !== null) {
    //console.log(raw[2] + " " + (player || player_raw).toString())
    return {
      action: raw[2],
      target: raw[1] || raw[3]
    };
  }
  else {
    return null;
  }
}

function gen_treat_regex() {
  var player_selector = "(?:[\\w_\\-]*)|(?:\\<@\\!\\d{18}\\>)";
  var start_name_selector = "(?:\\> *(" + player_selector + ") )?";
  var action_selector = "";
  Object.keys(actions).forEach(name => {
    action_selector = action_selector + "(?:" + actions[name].match + ")|";
  });
  actions_selector = "(" + action_selector.slice(0, action_selector.length - 1) + ")";
  var kinky_discarder = "(?:[\\~ ❤]*)"
  var full_string = "^ *" + start_name_selector + actions_selector + " *(" + player_selector + ")" + kinky_discarder + "$";
  //console.log(full_string);
  return new RegExp(full_string, "i");
}

function find_matching_action(string) {
  var result = null;

  Object.keys(actions).forEach(name => {
    if (new RegExp("^" + actions[name].match + "$").exec(string)) {
      result = actions[name];
    }
  });

  return result;
}

module.exports = function main(msg) {
  console.log(msg.content);
  // Checks if there is two or more "*" or "**" in the message's content
  if ((msg.content.match(/\*+/g) || []).length > 1) {
    var treated = treat(msg.content.replace(/\*/g, ""));
    if (treated !== null) {
      var author = msg.author.nickname || msg.author.username;
      var action = find_matching_action(treated.action);
      if (action !== null) {
        var embed = {
          title: action.disp
            .replace("{{author}}", author)
            .replace("{{target}}", treated.target),
        };
        if ((action.pics || []).length != 0) {
          embed.image = {
            url: action.pics[Math.floor(Math.random()*action.pics.length)]
          };
        }
        msg.channel.send({embed: embed});
      }
    }
  }
  else if (msg.content.startsWith("rp!")) {
    var commands = msg.content.slice(3).split(" ");
    if (commands[0] == "invite") {
      msg.channel.send({embed: {
        title: "Invitation link",
        description: "Use this link to add me to a server you can manage: https://discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=0",
        url: "https://discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=0"
      }});
    }
  }
}

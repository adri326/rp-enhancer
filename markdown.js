const utils = require("./utils");

function treat(string) {
  var raw = gen_treat_regex().exec(string);
  if (raw !== null) {
    let target = (raw[2] || "").trim(); // we love trimming :3

    discards.forEach(discard => {
      target = target.replace(new RegExp(discard.match), discard.disp);
    });

    return {
      action: raw[1].trim(),
      target
    };
  }
  else {
    return null;
  }
}

function gen_treat_regex() {
  var player_selector = "(?:@?[\\w_\\-]+ ?|(?:\\<@\\!?\\d{18}\\> ?))+";
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
  var suffix_discard = "(?:[\\~ ❤💜💚💛💙🖤🧡]*|\:-?[3\\)\\(\\/]))";
  var full_string = "^ *" + actions_selector + " *(" + player_selector + ")?" + suffix_discard + "$";
  // console.log(full_string);
  return new RegExp(full_string, "i");
}

module.exports = context => {
  let matched = /\*{1,3}(.+?)\*{1,3}/.exec(context.content);
  if (!matched) return;

  console.log(`![${context.author.username}#${context.author.discriminator}] ${context.content}`);

  let treated = treat(matched[1]);
  if (!treated) return;

  var action = utils.find_matching_action(treated.action, !!treated.target);
  if (!action) return;

  treated.implicit_target = "you"; // implicit target defaults to "you" (humans can also understand)

  if (action.disp.includes("{{last}}") || treated.target == "you") {
    var mention = /(?:\<@\!?(\d{18})\>)/.exec(context.content);
    if (mention) {
      treated.implicit_target = utils.get_nickname(mention[1], context.channel.guild);
    }
    else {
      utils.get_implicit_target(context, last_author => {
        treated.implicit_target = last_author || "you";
        second(context, action, treated);
      });
      return; // break out of the execution process - prevent the synchrone `second` to be triggered
    }
  }
  second(context, action, treated)
}

function second(context, action, treated) {
  let user = users[context.author.id] || utils.default_settings;

  let author_nick = utils.get_nickname(context.author, context.channel.guild);
  let target_nick = utils.target_nick(treated, context);
  let pictures = utils.load_pictures(action, user);
  let user_target = utils.get_user_target(treated, context);

  if (!pictures.length) {
    return;
  }

  let text = utils.gen_text(action, {
    treated,
    author_nick,
    target_nick
  });

  let author_color = utils.get_member_color(context, context.author.id);
  let color = author_color || 13477874;
  if (user_target) {
    let target_color = utils.get_member_color(context, user_target);
    if (target_color) {
      color = utils.blend(author_color, target_color, 0.4);
    }
  }

  let picture = pictures[Math.floor(Math.random() * pictures.length)];

  let embed = utils.gen_embed(text, picture, color);


  client.createMessage(context.channel.id, {embed});
}

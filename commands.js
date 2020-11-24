const fs = require("fs");
const utils = require("./utils");

const commands = {
  //help: require("./cmds/help")
};
fs.readdirSync("./cmds").forEach(file => {
  if (file.endsWith(".js")) {
    commands[file.slice(0, -3)] = require("./cmds/" + file);
  }
});

module.exports.run = (context) => {
  let args = split_args(context.content.slice(context.prefix.length));
  context.args = args;
  context.commands = commands;

  if (Object.keys(commands).includes(args[0])) {
    commands[args[0]](context);
  }
  else if (Object.keys(actions).includes(args[0])) {
    run_action(context, args[0]);
  }
}

function run_action(context, name) {
  let {args} = context;
  let action = actions[name];
  let treated = {
    action,
    target: (args[1] || "you").trim(),
    implicit_target: "you"
  };
  if (action.disp.includes("{{last}}") || treated.target == "you") {
    if (/(?:\<@\!?(\d{18})\>)/.exec(args[1])) {
      treated.implicit_target = utils.get_nickname(args[1], context.channel.guild)
    }
    else {
      utils.get_implicit_target(context, last_author => {
        treated.implicit_target = last_author || args[1] || "you";
        second(context, action, treated);
      });
      return;
    }
  }
  second(context, action, treated);
}

function second(context, action, treated) {
  let user = users[context.author.id] || utils.default_settings;

  let author_nick = utils.get_nickname(context.author, context.channel.guild);
  let target_nick = utils.target_nick(treated, context);
  let pictures = utils.load_pictures(action, user);
  let user_target = utils.get_user_target(treated, context);

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

function split_args(string) {
  return [].concat
    .apply([], string.split(/`(?:``)?/g)
    .map(function(v,i) {
      return i%2 ?
        v :
        v.split(' ');
    }))
    .filter(Boolean);
}

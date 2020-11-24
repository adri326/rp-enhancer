module.exports.get_implicit_target = (context, callback) => {
  context.channel.getMessages(25).then(messages => {
    let msg = messages.find(message => message.author.id != context.author.id && !message.author.bot);
    let last_author = null;
    if (msg) {
      last_author = module.exports.get_nickname(msg.author, context.guild);
    }
    callback(last_author);
  }).catch(console.error);
}

module.exports.get_nickname = (user, guild) => {

  if (guild && typeof user == "string") {
    user = user.replace(/<@!?(\d{18})>/, "$1");
    var guild_member = guild.members.get(user);
    if (guild_member) {
      if (guild_member.nick) {
        return guild_member.nick;
      }
      else if (guild_member.username) {
        return guild_member.username;
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

module.exports.load_pictures = (action, user, depth = 0) => {
  let sets = Object.entries(action.sets).filter(([key, value]) => user.sets.includes(key))
    .map(([key, value]) => value); // we only want values
  let pictures = [];
  sets.forEach(set => {
    pictures = pictures.concat(set);
  });
  if (action.parent && depth < 10) {
    let parent = actions[action.parent];
    if (parent) {
      pictures = pictures.concat(module.exports.load_pictures(parent, user, depth + 1)); // Warning: recursive
    }
  }
  return pictures;
}

module.exports.find_matching_action = (string, query_provided_target) => {
  var result = null;

  Object.keys(actions).forEach((name) => {
    if (actions[name].match != undefined) {
      if (new RegExp("^" + actions[name].match + "$", "i").exec(string)) {
        if (actions[name].target_required == 1 && query_provided_target || actions[name].target_required == 0 && !query_provided_target || actions[name].target_required == -1) {
          result = actions[name];
        }
      }
    }
  });

  return result;
}

module.exports.target_nick = (treated, context) => {
  let {target = "you", implicit_target = "you"} = treated;
  return module.exports.get_nickname(
    target.replace(
        /<@!?(\d{18})>/g,
        "$1"
      ).replace("you", implicit_target), // implicit target replacement
    context.channel.guild
  );
}

module.exports.gen_text = (action, settings) => {
  let {
    author_nick = "",
    target_nick = "",
    treated = {
      implicit_target: ""
    }
  } = settings;
  return action.disp.replace(/{{author}}/g, author_nick)
    .replace(/{{target}}/g, target_nick)
    .replace(/{{last}}/g, treated.implicit_target);
}

module.exports.gen_embed = function(text, picture, color) {
  let embed = null;

  if (Array.isArray(picture)) {
    embed = {
      title: text,
      color,
      url: picture[1],
      image: {
        url: picture[0]
      },
    };
    if (picture[2]) {
      embed.footer = {
        text: "By " + picture[2],
        url: picture[1]
      };
    }
  }
  else {
    embed = {
      title: text,
      color,
      url: picture,
      image: {
        url: picture
      }
    };
  }

  return embed;
}

module.exports.get_member_color = function(context, user = context.author.id) {
  let {channel} = context;
  if (!channel.guild) return 0;

  let guild = channel.guild;

  let member = guild.members.get(user);
  if (!member) return 0; // who knows?

  let roles = member.roles
    .map(role => guild.roles.get(role))
    .filter(Boolean)
    .sort((a, b) => a.position - b.position)
    .reverse();

  for (role of roles) {
    if (role && role.color) {
      return role.color;
    }
  }
}

module.exports.get_user_target = function(treated, context) {
  let {target = "you", implicit_target = "you"} = treated;

  let id = target.replace(
      /<@!?(\d{18})>/g,
      "$1"
    ).replace("you", implicit_target);

  if (id.toLowerCase() == "random" && context.channel.guild) {
    //let keys = context.channel.guild.members.entries().map(([k, v]) => k);
    //id = keys[Math.floor(Math.random() * keys.length)];
    id = context.channel.guild.members.random().id;
  }

  if (/\d{18}/.exec(id)) { // id is a correct discord id;
    return id;
  }
  else return null;
}

module.exports.blend = function(a, b, balance = 0.5) {
  let ar = a & 255;
  let ag = (a & (255 * 256)) / 256;
  let ab = (a & (255 * 256 * 256)) / 256 / 256;

  let br = b & 255;
  let bg = (b & (255 * 256)) / 256;
  let bb = (b & (255 * 256 * 256)) / 256 / 256;

  let red = Math.round(ar * (1 - balance) + br * balance);
  let green = Math.round(ag * (1 - balance) + bg * balance);
  let blue = Math.round(ab * (1 - balance) + bb * balance);

  return red + green * 256 + blue * 256 * 256;
}

module.exports.error_color = function error_color(context) {
  return module.exports.blend(+module.exports.get_member_color(context, context.author.id) || 16613512, 16613512, 0.25);
}

Object.defineProperty(module.exports, "default_settings", {
  value: {
    sets: ["anime", "anime_gif"],
    md_trigger: false,
    lang: "en"
  },
  writable: false
})

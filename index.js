const Eris = require("eris");
const fs = require("fs");
const commands = require("./commands");
const markdown = require("./markdown");
const utils = require("./utils");
const exithandler = require("./exithandler");

const prefix = "rp!";

global.client = null;
global.owner = null;
try {
  global.users = require("./data/users.json");
} catch (e) {
  console.error(e);
  console.error("Couldn't load data/users.json; skipping! (there will be no user configs loaded)");
  global.users = [];
}
try {
  global.guilds = require("./data/guilds.json");
} catch (e) {
  console.error(e);
  console.error("Couldn't load data/guilds.json; skipping! (there will be no guild configs loaded)");
  global.guilds = [];
}

// Load secret data
{
  let secret = require("./data/secret.json");
  client = new Eris.Client(secret.token);
  global.owner = secret.owner;
  global.suggestion_channel = secret.suggestion_channel;
}

global.actions = require("./data/actions.json");
global.discards = require("./data/discards.json");

client.on("messageCreate", context => {
  if (context.bot) return;
  if (context.content.startsWith(prefix)) {
    context.prefix = prefix;
    console.log("[" + context.author.username + "#" + context.author.discriminator + "] " + context.content);
    commands.run(context);
  }
  if (
    !(context.channel instanceof Eris.PrivateChannel)
    && users[context.author.id]
    && users[context.author.id].md_trigger === true
    || (
      !(context.channel instanceof Eris.PrivateChannel)
      && (users[context.author.id]
        && users[context.author.id].md_trigger === -1
        || !users[context.author.id]
      )
      && guilds[context.channel.guild.id]
      && guilds[context.channel.guild.id].md_trigger
    )
  ) {
    markdown(context);
  }
});

client.on("ready", () => {
  console.log("Logged in!");
  client.editStatus("online", {
    name: `${prefix}changelog`,
    type: 2
  });
});

client.connect().catch(console.error);

{
  let can_save = false;
  global.save = function save() {
    can_save = true;
  }
  setInterval(() => {
    if (can_save) {
      fs.writeFileSync("./data/users.json", JSON.stringify(users));
      fs.writeFileSync("./data/guilds.json", JSON.stringify(guilds));
    }
  }, 60*1000);
}

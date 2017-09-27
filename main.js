const log = require("./log");
const Discord = require("discord.js");
const fs = require("fs");
const treat = require("./treat");
discordadmins = require("./package.json")._discordadmins;

log("DONE", "loading modules");
log("START", "loading saves");

actions = require("./actions.json");
discards = require("./discards.json");

log("DONE", "loading saves");
log("START", "loading secret");

const secret = JSON.parse(fs.readFileSync("./secret.json"));

owner = secret.owner;

log("DONE", "loading secret");
log("START", "logging in");

bot = new Discord.Client();
bot.login(secret.token);

bot.on("ready", () => {
  log("DONE", "logging in");
});

bot.on("message", msg => {
  let perms = msg.channel.permissionsFor(bot.user);
  if (perms.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
    treat(msg);
  }
});

bot.on("ready", () => {
  bot.user.setPresence({game: {name: "rp!help"}});
});

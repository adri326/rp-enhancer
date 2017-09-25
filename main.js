const log = require("./log");
const Discord = require("discord.js");
const fs = require("fs");
const treat = require("./treat");
discordadmins = require("./package.json")._discordadmins;

log("DONE", "loading modules");
log("START", "loading actions");

actions = JSON.parse(fs.readFileSync("./actions.json"));

log("DONE", "loading actions");
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

bot.on("message", treat);

bot.on("ready", () => {
  bot.user.setPresence({game: {name: "rp!help"}});
});

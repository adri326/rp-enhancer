const log = require("./log");
const Discord = require("discord.js");
const fs = require("fs");
const treat = require("./treat");

log("DONE", "loading modules");
log("START", "loading actions");

actions = JSON.parse(fs.readFileSync("./actions.json"));

log("DONE", "loading actions");
log("START", "loading secret");

const secret = JSON.parse(fs.readFileSync("./secret.json"));

log("DONE", "loading secret");
log("START", "logging in");

bot = new Discord.Client();
bot.login(secret.token);

bot.on("ready", () => {
  log("DONE", "logging in");
});

bot.on("message", treat);

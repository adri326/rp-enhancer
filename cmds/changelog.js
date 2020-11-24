module.exports = function(context) {
  let {prefix} = context;
  let embed = {
    title: "Changelog!",
    description: "RolePlay Enhancer version 2 just rolled out! These are the changes / new features that come with it",
    fields: [
      {name: "Settings", value: "Settings are now available, these being per-guild and per-user. More information available with `" + prefix + "help`"},
      {name: "Commands", value: "A few new commands have been added, check them out using `" + prefix + "help`"},
      {name: "Feedback", value: "You can now send feedback, propose new pictures or send us other stuff using `" + prefix + "submit`. We'd love to hear about you!"},
      {name: "Picture sets", value: "You maybe want some furry reaction pictures, or non-gif pictures, who knows. There is now the option for you to do this, informations about this are found in the help commands"},
      {name: "Settings", value: "You read it: you can now modify a few settings, so the bot will better fit to your preferences"}
    ],
    footer: {
      text: "Brought to you with love, ShaDryx"
    },
    url: "https://shadamethyst.xyz/"
  };
  client.createMessage(context.channel.id, {embed});
}

module.exports.display_name = "Changelog";
module.exports.description = "Information about the bot's latest changes";
module.exports.usage = "changelog";

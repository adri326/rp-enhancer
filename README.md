[![Discord Bots](https://discordbots.org/api/widget/servers/351641523198230528.svg?noavatar=true&leftcolor=171425&lefttextcolor=E4EBFE&rightcolor=352A40)](https://discordbots.org/bot/351641523198230528)

# rp-enhancer
A discord bot, that uses the classic roleplay syntax to trigger cute gifs (`*action [target]*`)

## Installation

Clone this repository:

```sh
git clone https://github.com/adri326/rp-enhancer/
cd rp-enhancer
```

Then, create a set of config files:

```sh
echo "[]" > data/users.json
echo "[]" > data/guilds.json
cp data/secret.json.sample data/secret.json
```

You will then need to edit `data/secret.json` to fill in the required details.
You may also want to edit `cmds/changelog.js` if you do any changes.

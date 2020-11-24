const fs = require("fs");

const exitHandler = module.exports.exitHandler = function exitHandler(_, err) {
  if (_.exception) console.error("Uncaught exception:\n", err);
  else if (!_.exit) {
    console.log();
    try {
      fs.writeFileSync("./data/users.json", JSON.stringify(users));
    }
    catch (e) {
      console.error(e);
      process.exit(1);
    }
    console.log("Saved!");
    client.disconnect();
    process.exit();
  }
}

process.on("exit", exitHandler.bind(null, {exit: true}));
process.on("SIGINT", exitHandler.bind(null, {}));
process.on("uncaughtException", (err) => {exitHandler({exception: true}, err)});

module.exports = function log(message = "", description) {
  if (message == "") {
    console.log();
  }
  else {
    var date = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
    if (typeof description == "undefined") {
      console.log(date + " | " + message);
    }
    else {
      console.log(date + " | " + String(message + "     ").slice(0, 5) + " | " + description);
    }
  }
}

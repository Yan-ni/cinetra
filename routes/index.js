const fs = require("fs");

const routers = {};

const directories = fs.readdirSync(__dirname);

directories.forEach((directory) => {
  const direcrotyName = directory.split(".")[0];

  if (direcrotyName === "index") return;

  routers[`${direcrotyName}Router`] = require(`./${direcrotyName}`);
});

module.exports = routers;

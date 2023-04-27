const AI = require("../src/index.js");

AI("return x=1 in JSON", { parser: JSON.parse }).then(console.log);
const AI = require("../src/index.js");

AI("the color of the sky is", { model: "text-davinci-003", temperature: 0 }).then(console.log);
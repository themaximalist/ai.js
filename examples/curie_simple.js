const AI = require("../src/index.js");

AI("the color of the sky is", { model: "text-curie-001", temperature: 0 }).then(console.log);
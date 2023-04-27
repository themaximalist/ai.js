const AI = require("../src/index.js");

AI("return a tiny random JSON object", { parser: AI.parseJSONFromText }).then(console.log);
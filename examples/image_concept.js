const AI = require("../src/index.js");
const { writeFileSync } = require("fs");

AI.Image.Concept("a red rose").then((buffer) => {
    console.log(buffer);
    writeFileSync("rose.png", buffer);
});
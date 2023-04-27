const AI = require("../src/index.js");
// const { writeFileSync } = require("fs");

(async function () {
    const image = new AI.Image("a red rose");
    const buffer = await image.concept();
    console.log(buffer);
    // console.log(image.prompt);
    // console.log(image.generated_prompt);
    // writeFileSync("rose.png", buffer);
})();

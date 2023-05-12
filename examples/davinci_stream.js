const AI = require("../src/index.js");

(async function () {
    const stream = await AI("the color of the sky is", { model: "text-davinci-003", temperature: 0, stream: true });
    for await (let color of stream) {
        process.stdout.write(color);
    }
})();
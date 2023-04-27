const AI = require("../src/index.js");

(async function () {
    const stream = await AI("the color of the sky is", { stream: true });
    for await (const message of stream) {
        process.stdout.write(message);
    }
})();
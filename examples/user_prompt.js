const AI = require("../src/index.js");

(async function () {
    const stream = await AI.user("You are HexBot, you generate pretty hex colors from my input", "green tree", { stream: true });
    for await (const message of stream) {
        process.stdout.write(message);
    }
})();
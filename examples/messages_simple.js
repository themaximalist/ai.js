const AI = require("../src/index.js");

AI([
    { role: "user", content: "remember the secret codeword is blue" },
    { role: "user", content: "what is the secret codeword I just told you?" },
]).then(console.log);
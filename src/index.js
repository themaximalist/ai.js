const log = require("debug")("ai.js:index");

const AI = require("./llm");
const Image = require("./image");

AI.Image = require("./image");

module.exports = AI;

const assert = require("assert");
const { describe, it } = require("mocha");

const AI = require("../src/index");

describe("llm", function () {
    this.timeout(10000);
    this.slow(2500);

    describe("openai", function () {

        it("simple string", async function () {
            const response = await AI("the color of the sky is");
            assert(response.toLowerCase().indexOf("blue") !== -1);
        });

        it("simple string streaming", async function () {
            const stream = await AI("the color of the sky is", { stream: true });
            let response = "";
            let found = false;
            for await (const token of stream) {
                response += token;
                if (response.toLowerCase().indexOf("blue") !== -1) {
                    found = true;
                    break;
                }
            }
            assert(found);
        });
    });
});
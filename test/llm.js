const assert = require("assert");
const { describe, it } = require("mocha");

const AI = require("../src/index");
const { expectStream } = require("./utils");

describe("llm", function () {
    this.timeout(10000);
    this.slow(2500);

    describe("openai", function () {
        it("string", async function () {
            const response = await AI("the color of the sky is");
            assert(response.toLowerCase().indexOf("blue") !== -1);
        });

        it("array", async function () {
            const messages = [{ role: "user", content: "the codeword is blue, remember it" }];
            const ai = new AI(messages, { stream: true });
            const stream = await ai.chat("what is the codeword?");
            assert(await expectStream(stream, "blue"));
        });

        it("streaming", async function () {
            const stream = await AI("the color of the sky is", { stream: true });
            assert(await expectStream(stream, "blue"));
        });

        it("custom temperature", async function () {
            const response = await AI("the color of the sky is", { temperature: 0 });
            assert.equal(response, "blue during the day and black at night. However, during sunrise and sunset, the sky can take on a range of colors including shades of pink, orange, and purple.");
        });

        it("max tokens", async function () {
            const response = await AI("the color of the sky is", { temperature: 0, max_tokens: 1 });
            assert.equal(response, "blue");
        });

        it("extract schema", async function () {
            const schema = {
                type: "object",
                properties: {
                    color: { type: "string" },
                },
                allowAdditionalProperties: false,
            };

            const response = await AI("the color of the sky is blue", {
                model: "gpt-3.5-turbo-16k",
                temperature: 0,
                schema,
                function_call: "extract_schema",
            });
            assert.deepEqual(response, { color: "blue" });
        });
    });

    describe("anthropic", function () {
        it("string", async function () {
            const response = await AI("the color of the sky is", { service: "anthropic" });
            assert(response.toLowerCase().indexOf("blue") !== -1);
        });

        it("array", async function () {
            const messages = [{ role: "user", content: "2+2=" }];
            const ai = new AI(messages, { service: "anthropic", stream: true });
            const stream = await ai.send();
            assert(await expectStream(stream, "4"));
        });

        it("streaming", async function () {
            const stream = await AI("the color of the sky is", { service: "anthropic", stream: true });
            assert(await expectStream(stream, "blue"));
        });

        it("custom temperature", async function () {
            const response = await AI("the color of the sky is frequently", { service: "anthropic", temperature: 0 });
            assert.equal(response, "Blue. The color of the sky is frequently blue.");
        });

        it("max tokens", async function () {
            const response = await AI("the color of the sky is frequently", { service: "anthropic", temperature: 0, max_tokens: 1 });
            assert.equal(response, "Blue");
        });

        it("partial prompt", async function () {
            const messages = [
                { role: "user", content: "the color of the sky can be" },
                { role: "assistant", content: "yellow because" },
            ];
            const response = await AI(messages, { service: "anthropic", temperature: 0, partial: true });
            assert.equal(response, "of the sun");
        });

        it("accurate partial message history", async function () {
            const messages = [
                { role: "user", content: "the color of the sky can be" },
                { role: "assistant", content: "yellow because" },
            ];
            const ai = new AI(messages, { service: "anthropic", temperature: 0, partial: true });
            assert(ai.partial);
            const response = await ai.send();
            assert.equal(response, "of the sun");
            assert(!ai.partial);
            assert.equal(ai.lastMessage.role, "assistant");
            assert.equal(ai.lastMessage.content, "yellow because of the sun");
        });
    });

    it("throws error on function call", async function () {
        const schema = {
            type: "object",
            properties: {
                color: { type: "string" },
            },
            allowAdditionalProperties: false,
        };

        let error = null;
        try {
            await AI("the color of the sky is blue", {
                service: "anthropic",
                temperature: 0,
                schema,
                function_call: "extract_schema",
            })
            assert.fail("Should have thrown error");
        } catch (e) {
            error = e;
            assert.ok("Should have thrown error");
        } finally {
            assert(error);
        }
    });
});
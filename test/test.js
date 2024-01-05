import assert from "assert";

import AI from "../src/index.js";

// AI.js is a wrapper. These libraries are already tested, we just test them here for basic correctness

describe("llm", function () {
    this.timeout(10000);
    this.slow(2500);

    it("prompt (llamafile)", async function () {
        const response = await AI("the color of the sky is", { temperature: 0 });
        assert(response.toLowerCase().indexOf("blue") !== -1);
    });

    it("prompt (openai)", async function () {
        const response = await AI("the color of the sky is", { temperature: 0, model: "gpt-3.5-turbo" });
        assert(response.toLowerCase().indexOf("blue") !== -1);
    });
});

describe("imagine", function () {
    this.timeout(15000);
    this.slow(10000);

    it("prompt (replicate)", async function () {
        const buffer = await AI.Imagine("a red rose", { service: AI.Imagine.REPLICATE });
        assert(buffer instanceof Buffer);
        assert(buffer.length > 0);
    });
});

describe("embeddings", function () {
    this.timeout(15000); // first run is slow
    this.slow(2500);

    it("embeddings (local)", async function () {
        const buffer = await AI.Embeddings("hello world");
        assert(buffer instanceof Array);
        assert(buffer.length == 384, buffer.length);
    });
});

describe("vectordb", function () {
    this.timeout(15000); // first run is slow
    this.slow(2500);

    it("vectordb", async function () {
        const vectordb = new AI.VectorDB();
        await vectordb.add("red");
        await vectordb.add("blue");
        const colors = await vectordb.search("redish");

        assert(colors.length > 0);
        assert(colors[0].input == "red");
    });
});


// imagine.js concept (llm -> stable diffusion0)
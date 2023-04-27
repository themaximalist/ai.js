const log = require("debug")("ai.js:image:replicate");
const fetch = require("node-fetch");

function createAPI() {
    if (!process.env.REPLICATE_API_KEY) throw new Error("REPLICATE_API_KEY is not set.");
    const Replicate = require("replicate");
    return new Replicate({
        auth: process.env.REPLICATE_API_KEY,
        fetch,
    });
}

let replicate = null;
async function generate(prompt_text, options = {}) {
    if (!options) options = {};
    if (!options.model) options.model = generate.defaultModel;
    if (!replicate) replicate = createAPI();

    try {
        log(`hitting replicate API (model=${options.model})`);
        const output = await replicate.run(
            `stability-ai/${options.model}`,
            {
                input: {
                    image_dimensions: "512x512",
                    scheduler: "K_EULER",
                    num_outputs: 1,
                    prompt: prompt_text,
                }
            }
        );

        const remote_image_url = output[0];
        log(`generated replicate image url ${remote_image_url}`);

        const response = await fetch(remote_image_url);
        return await response.buffer();
    } catch (e) {
        log(`error running replicate generate: ${e}`);
        return null;
    }
}

generate.defaultModel = "stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";

module.exports = generate;

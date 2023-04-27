const log = require("debug")("ai.js:image:stability");

const BASE_URL = "https://api.stability.ai";

async function generate(prompt_text, options = null) {
    if (!options) options = {};
    if (!options.model) options.model = generate.defaultModel;

    try {
        if (!process.env.STABILITY_API_KEY) throw new Error("STABILITY_API_KEY is not set.");
        log(`hitting stability API (model=${options.model})`);

        const response = await fetch(
            `${BASE_URL}/v1/generation/${options.model}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
                },
                body: JSON.stringify({
                    text_prompts: [{ text: prompt_text }],
                    cfg_scale: 7,
                    clip_guidance_preset: 'FAST_BLUE',
                    height: 512,
                    width: 512,
                    samples: 1,
                    sampler: "K_EULER",
                    steps: 50,
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`invalid response: ${await response.text()}`)
        }

        const data = await response.json();
        if (!data || data.artifacts.length !== 1) {
            throw new Error(`invalid response: ${data}`);
        }

        const image = data.artifacts[0];

        return Buffer.from(image.base64, 'base64')
    } catch (e) {
        log(`error running stability generate: ${e}`);
        return null;
    }
}

generate.defaultModel = "stable-diffusion-xl-beta-v2-2-2";

module.exports = generate;
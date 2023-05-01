const log = require("debug")("ai.js:image:stability");
const fetch = require("node-fetch");

const BASE_URL = "https://api.stability.ai";

async function generate(prompt_text, options = null) {
    if (!options) options = {};
    if (!options.model) options.model = generate.defaultModel;
    if (!options.seed) throw new Error("generate expects a stable seed");

    let stability = options.stability || {};
    if (!stability.cfg_scale) stability.cfg_scale = 7; // 0-35
    if (!stability.clip_guidance_preset) stability.clip_guidance_preset = 'FAST_BLUE'; // FAST_BLUE FAST_GREEN NONE SIMPLE SLOW SLOWER SLOWEST
    if (!stability.height) stability.height = 512;
    if (!stability.width) stability.width = 512;
    if (!stability.samples) stability.samples = 1;
    if (!stability.sampler) stability.sampler = "K_EULER"; // DDIM DDPM K_DPMPP_2M K_DPMPP_2S_ANCESTRAL K_DPM_2 K_DPM_2_ANCESTRAL K_EULER K_EULER_ANCESTRAL K_HEUN K_LMS
    if (!stability.steps) stability.steps = 50; // 10-150
    stability.text_prompts = [{ text: prompt_text }];

    try {
        if (!process.env.STABILITY_API_KEY) throw new Error("STABILITY_API_KEY is not set.");
        log(`hitting stability ${options.model} API ${JSON.stringify(stability)}`);

        const start = Date.now();

        const response = await fetch(
            `${BASE_URL}/v1/generation/${options.model}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
                },
                body: JSON.stringify(stability),
            }
        )

        const end = Date.now();
        log(`stability API took ${(end - start) / 1000}s`);

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
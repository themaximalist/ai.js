const log = require("debug")("ai.js:image");

const LLM = require("./llm");
const services = require("./services");

const CONCEPT_PROMPT = `
I am Concept2Prompt.

My task is to generate rich and dynamic scenes using my input text.

RULES
* Take the provided input and create a perfect scene.
* Create a visually striking scene that captures the essence of the input and its core concepts.
* Be concise, describe scenes with keyword rich phrases, separated by commas (CSV)
* Be sure to include common artistic styles, medium, artist names, inspiration, resolution, and any other useful details, such as color and lighting.
* It's a good idea to include CSV keywords like "4k, hd"
`.trim();

function Image(prompt, options = null) {
    if (!options) options = {};

    if (!(this instanceof Image)) {
        return new Promise(async (resolve, reject) => {
            const image = new Image(prompt, options);
            resolve(await image.send());
        });
    }

    this.options = options;
    this.prompt = prompt;
    this.generated_prompt = null;
    this.service = options.service || process.env.AI_IMAGE_SERVICE || "stability";
    this.model = options.model || process.env.AI_IMAGE_MODEL || services.image[this.service].defaultModel;

    this.concept_service = options.concept_service || process.env.AI_SERVICE || "openai";
    this.concept_model = options.concept_model || process.env.AI_MODEL || services.llm[this.concept_service].defaultModel;
    this.concept_prompt = options.concept_prompt || CONCEPT_PROMPT;
}

Image.prototype.send = async function (options = null) {
    const service = services.image[this.service];
    if (!service) throw new Error(`AI.js is using "${this.service}" but it is not enabled. Please set the ${this.service.toLocaleUpperCase()}_API_KEY environment variable.`);

    if (!options) options = this.options;
    if (!options.model) options.model = this.model;

    log(`sending ${this.service} image generation request`);
    return await service(this.prompt, options);
}

Image.prototype.generate_concept_prompt = async function (options = null) {
    if (!this.prompt) throw new Error("concept expects a prompt");
    if (!options) options = {};

    const concept_prompt = options.concept_prompt || this.concept_prompt;
    const concept_service = options.concept_service || this.concept_service;
    const concept_model = options.concept_model || this.concept_model;

    const llm = new LLM(null, {
        service: concept_service,
        model: concept_model
    });

    llm.system(concept_prompt);
    llm.user(this.prompt);

    this.generated_prompt = await llm.send();
    log(`generated prompt: ${this.generated_prompt}`);

    return this.generated_prompt;
}

Image.prototype.concept = async function (options = null) {
    await this.generate_concept_prompt(options);
    return await Image(this.generated_prompt, options);
}

Image.Concept = async function (input, options = null) {
    const image = new Image(input, options);
    return await image.concept(options);
}

module.exports = Image;

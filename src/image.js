const log = require("debug")("ai.js:image");

const services = require("./services");

function Image(input, options = null) {
    if (!options) options = {};

    if (!(this instanceof Image)) {
        return new Promise(async (resolve, reject) => {
            const image = new Image(input, options);
            resolve(await image.send());
        });
    }

    this.input = input;
    this.service = options.service || process.env.AI_IMAGE_SERVICE || "stability";
    this.model = options.model || process.env.AI_IMAGE_MODEL || services.image[this.service].defaultModel;
}

Image.prototype.send = async function (options = null) {
    const service = services.image[this.service];
    if (!service) throw new Error(`AI.js is using "${this.service}" but it is not enabled. Please set the ${this.service.toLocaleUpperCase()}_API_KEY environment variable.`);

    if (!options) options = {};
    if (!options.model) options.model = this.model;

    log(`sending ${this.service} image generation request`);
    return await service(this.input, options);
}

module.exports = Image;

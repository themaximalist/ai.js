const log = require("debug")("ai.js:llm");

const services = require("./services");
const { parseJSONFromText } = require("./parsers");

function AI(input, options = null) {
    if (!options) options = {};

    if (!(this instanceof AI)) { // function call
        return new Promise(async (resolve, reject) => {
            const llm = new AI(input, options);
            try {
                resolve(await llm.send());
            } catch (e) {
                reject(e);
            }
        });
    }

    let messages;
    if (typeof input === "string") {
        messages = [{ role: "user", content: input }];
    } else if (Array.isArray(input)) {
        messages = input;
    } else if (input === null || input === undefined) {
        messages = [];
    } else {
        throw new Error("Invalid input");
    }

    this.service = options.service || process.env.AI_SERVICE || "openai";
    this.model = options.model || process.env.AI_MODEL || services.llm[this.service].defaultModel;
    this.parser = options.parser || null;
    this.temperature = (typeof options.temperature != "undefined" ? options.temperature : null);
    this.max_tokens = (typeof options.max_tokens != "undefined" ? options.max_tokens : null);
    this.seed = (typeof options.seed != "undefined" ? options.seed : null);
    this.schema = options.schema || null;
    this.function_call = options.function_call || null;
    this.stream = !!options.stream;
    this.partial = !!options.partial;
    this.context = options.context || AI.CONTEXT_FULL;
    this.messages = messages;

    this.__defineGetter__("lastMessage", () => {
        return this.messages[this.messages.length - 1];
    });

    return this;
}

AI.CONTEXT_FIRST = "AI_CONTEXT_FIRST";
AI.CONTEXT_LAST = "AI_CONTEXT_LAST";
AI.CONTEXT_OUTSIDE = "AI_CONTEXT_OUTSIDE"; // first and last
AI.CONTEXT_FULL = "AI_CONTEXT_FULL";


AI.prototype.chat = async function (content, options = null) {
    this.user(content);
    return await this.send(options);
}

AI.prototype.user = function (content) {
    this.messages.push({ role: "user", content });
}

AI.prototype.system = function (content) {
    this.messages.push({ role: "system", content });
}

AI.prototype.assistant = function (content) {
    if (this.partial) {
        this.lastMessage.content += ` ${content}`;
        this.partial = false;
    } else {
        this.messages.push({ role: "assistant", content });
    }
}

AI.prototype.send = async function (options = null) {
    const service = services.llm[this.service];
    if (!service) throw new Error(`AI.js is using "${this.service}" but it is not enabled. Please set the ${this.service.toLocaleUpperCase()}_API_KEY environment variable.`);

    if (!options) options = {};
    options.stream = !!options.stream;
    if (!options.model) options.model = this.model;
    if (!options.stream && this.stream) options.stream = this.stream;
    if (!options.parser && this.parser) options.parser = this.parser;
    if (!options.partial && this.partial) options.partial = this.partial;
    if (!options.context) options.context = this.context;
    if ((typeof options.temperature == "undefined" || options.temperature == null) && this.temperature !== null) options.temperature = this.temperature;
    if ((typeof options.seed == "undefined" || options.seed == null) && this.seed !== null) options.seed = this.seed;
    if ((typeof options.max_tokens == "undefined" || options.max_tokens == null) && this.max_tokens !== null) options.max_tokens = this.max_tokens;
    if ((typeof options.schema == "undefined" || options.schema == null) && this.schema !== null) options.schema = this.schema;
    if ((typeof options.function_call == "undefined" || options.function_call == null) && this.function_call !== null) options.function_call = this.function_call;

    let messages;
    if (options.context == AI.CONTEXT_FIRST) {
        messages = this.messages.slice(0, 1);
    } else if (options.context == AI.CONTEXT_LAST) {
        messages = this.messages.slice(-1);
    } else if (options.context == AI.CONTEXT_OUTSIDE) {
        messages = [this.messages[0], this.messages[this.messages.length - 1]];
    } else {
        messages = this.messages;
    }

    if (options.stream) {
        options.streamCallback = (content) => {
            this.assistant(content);
        };
    }

    log(`sending ${this.service} completion with ${messages.length} messages (stream=${options.stream})`);
    const completion = await service(messages, options);

    if (options.stream) {
        return completion;
    } else {
        this.assistant(completion);
        return completion;
    }
}

AI.system = async function (prompt, input, options = null) {
    const llm = new AI(null, options);
    llm.system(prompt);
    llm.user(input);
    return await llm.send();
}

AI.user = async function (prompt, input, options = null) {
    const llm = new AI(null, options);
    llm.user(prompt);
    llm.user(input);
    return await llm.send();
}

AI.parseJSONFromText = parseJSONFromText;

module.exports = AI;
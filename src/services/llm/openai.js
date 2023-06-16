const log = require("debug")("ai.js:llm:openai");
function createAPI() {
    const { Configuration, OpenAIApi } = require("openai");
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set.");
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    return new OpenAIApi(configuration);
}

function isChatCompletionModel(model) {
    if (model.indexOf("text-davinci") == 0) return false;
    if (model.indexOf("text-curie") == 0) return false;
    if (model.indexOf("text-babbage") == 0) return false;
    if (model.indexOf("text-ada") == 0) return false;
    return true;
}

let openai = null;
async function completion(messages, options = {}) {
    if (!openai) openai = createAPI();
    if (!options) options = {};
    if (!options.model) options.model = completion.defaultModel;
    if (!Array.isArray(messages)) throw new Error(`openai.completion() expected array of messages`);

    let networkOptions = {};
    if (options.stream) networkOptions.responseType = "stream";

    const isChatModel = isChatCompletionModel(options.model);
    const isFunctionCall = typeof options.schema !== "undefined" && typeof options.function_call !== "undefined";

    const openaiOptions = {
        model: options.model,
        stream: options.stream,
    };

    if (typeof options.temperature !== "undefined") {
        openaiOptions.temperature = options.temperature;
        if (openaiOptions.temperature < 0) openaiOptions.temperature = 0;
        if (openaiOptions.temperature > 2) openaiOptions.temperature = 2;
    }

    if (typeof options.max_tokens !== "undefined") {
        openaiOptions.max_tokens = options.max_tokens;
    }

    if (isFunctionCall) {
        openaiOptions.functions = [{
            name: options.function_call,
            parameters: options.schema
        }];
        openaiOptions.function_call = { name: options.function_call };
    }

    log(`hitting openai ${isChatModel ? "chat" : "regular"} completion API with ${messages.length} messages (${JSON.stringify(openaiOptions)})`)

    let response;
    if (isChatModel) {
        openaiOptions.messages = messages;
        response = await openai.createChatCompletion(openaiOptions, networkOptions);
    } else {
        openaiOptions.prompt = messages.map(message => message.content).join("\n").trim(); // hacky
        response = await openai.createCompletion(openaiOptions, networkOptions);
    }

    if (options.stream) {
        const parser = options.parser || completion.parseStream;
        return parser(response, options.streamCallback, isChatModel);
    } else {
        let content;
        if (isChatModel) {
            if (isFunctionCall) {
                const message = response.data.choices[0].message;
                if (!message.function_call) throw new Error(`Expected function call response from OpenAI, got ${JSON.stringify(message)}`);
                if (message.function_call.name !== options.function_call) throw new Error(`Expected function call response from OpenAI for ${options.function_call}, got ${message.function_call.name}`);
                if (!message.function_call.arguments) throw new Error(`Expected function call response from OpenAI for ${options.function_call} to have arguments, got ${JSON.stringify(message.function_call)}`);
                const args = response.data.choices[0].message.function_call.arguments;
                try {
                    return JSON.parse(args);
                } catch (e) {
                    throw new Error(`Expected function call response from OpenAI for ${options.function_call} to have valid JSON arguments, got ${args}`)
                }
            }
            content = response.data.choices[0].message.content.trim();
        } else {
            content = response.data.choices[0].text.trim();
        }

        if (options.parser) {
            return options.parser(content);
        }

        return content;
    }
}

completion.parseStream = async function* (response, callback = null, isChatModel = true) {
    let content = "";
    for await (const chunk of response.data) {
        const lines = chunk
            .toString("utf8")
            .split("\n")
            .filter((line) => line.trim().startsWith("data: "));

        for (const line of lines) {
            const message = line.replace(/^data: /, "");
            if (message === "[DONE]") {
                if (callback) {
                    callback(content);
                }
                return content;
            }

            const json = JSON.parse(message);
            let token;
            if (isChatModel) {
                token = json.choices[0].delta.content;
            } else {
                token = json.choices[0].text;
            }
            if (!token) continue;

            content += token;
            yield token;
        }
    }
};

completion.defaultModel = "gpt-3.5-turbo";

module.exports = completion;
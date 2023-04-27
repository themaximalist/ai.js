#!/usr/bin/env node
const log = require("debug")("ai.js:cli");

const { Command } = require("commander");
const { writeFileSync } = require("fs");

const prompt = require("prompt-sync")({
    sigint: true,
    history: require("prompt-sync-history")()
});

const AI = require("./index");
const packagejson = require("../package.json");
const utils = require("./utils");

const program = new Command();

async function LLM(input, options) {
    log(`running in LLM mode with input: ${input}, options: ${JSON.stringify(options)}`);
    options.stream = true;
    if (options.chat) {
        const ai = new AI(input, options);
        while (true) {
            const stream = await ai.fetch(options);
            for await (const token of stream) {
                process.stdout.write(token);
            }
            process.stdout.write("\n");
            const input = prompt("> ");
            ai.user(input);
        }
    } else {
        const stream = await AI(input, options);
        for await (const token of stream) {
            process.stdout.write(token);
        }
        process.stdout.write("\n");
    }
}

async function IMAGE(input, options) {
    log(`running in image mode with input: ${input}, options: ${JSON.stringify(options)}`);

    let buffer;
    if (options.concept) {
        buffer = await AI.Image.Concept(input, options);
    } else {
        buffer = await AI.Image(input, options);
    }
    await utils.openImageInViewer(buffer);
}

async function run(input, options) {
    log(`running ai.js CLI with input: ${input}, options: ${JSON.stringify(options)}`);

    if (options.image || options.concept) {
        return await IMAGE(input, options);
    } else {
        return await LLM(input, options);
    }

}

program
    .name("ai")
    .description(packagejson.description)
    .version(`AI cli interface to generate chat completions and images`)

program
    .option('-s, --service <service>', 'AI Service (default: openai)')
    .option('-m, --model <model>', 'Completion Model (default: gpt-3.5-turbo)')
    .option('-c, --chat', 'Chat Mode')
    .option('-i, --image', 'Image Mode')
    .option('--concept', 'Concept Image Mode')
    .argument('[input]', 'Input to send to AI service')
    .action((input, options) => {
        if (!input) {
            program.help();
            return;
        }

        input = program.args.join(" ");

        run(input, options);
    });

program.parse(process.argv);

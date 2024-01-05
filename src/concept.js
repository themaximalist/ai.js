import LLM from "@themaximalist/llm.js";
import Imagine from "@themaximalist/imagine.js";

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

async function Concept2Prompt(input, options = {}) {
    const llm = new LLM([], options.concept || {});
    llm.system(CONCEPT_PROMPT);
    return await llm.chat(input);
}

export default async function Concept(input, options = {}) {
    const prompt = await Concept2Prompt(input, options);
    const buffer = await Imagine(prompt, options);
    return { prompt, buffer };
}
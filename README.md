# AI.js

<img src="logo.png" />

<div class="badges" style="text-align: center">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/themaximal1st/ai.js">
<img alt="NPM Downloads" src="https://img.shields.io/npm/dt/%40themaximalist%2Fai.js">
<img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/themaximal1st/ai.js">
<img alt="GitHub License" src="https://img.shields.io/github/license/themaximal1st/ai.js">
</div>

<br />

`AI.js` is the easiest way to add AI text, images, embeddings and vector search to your Node.js app.

```javascript
await AI("the color of the sky is"); // blue

await AI.Image("a red rose"); // <image buffer: red rose>

await AI.Image.Concept("a red rose"); // {prompt: a red rose in realist style, watercolor ...", <image buffer>}

await AI.Embeddings("hello world", { id: "123123"}); // Array(384)

const db = new AI.VectorDB();
await db.add("red");
await db.search("redish") // red
```

Under the hood `AI.js` seamlessly integrates easy to use local and remote APIs

* **Text:** [LLM.js](https://llmjs.themaximalist.com) use `GPT-4`, `Claude`, `Mistral` or `LLaMa` in same simple interface
* **Image:** [Imagine.js](https://imaginejs.themaximalist.com/) supports local `Stable Diffusion` and remote services like `Replicate` and `Stability AI`
* **Embeddings:** [Embeddings.js](https://embeddingsjs.themaximalist.com/) create `local`, `OpenAI` or `Mistral` embeddings
* **VectorDB:** [VectorDB.js](https://vectordbjs.themaximalist.com/) searches similar embeddings in memory
* **Audio:** *Coming Soon*
* **Video:** *Coming Soon*

*AI.js is under heavy development and still subject to breaking changes.*

## Features

* Easy to use
* Same simple interface for hundreds of models
* All services offer a free local default, and paid 3rd party API
* LLM with advanced features like one-shot prompts, chat history, streaming and JSON schema support
* Image generation using the best open and paid models
* Image concepts to easily combine LLMs with Image generators for impressive results
* Easy to use text embeddings and vector search
* MIT license



## Installation

Install `AI.js` via npm

```bash
npm install @themaximalist/ai.js
```

Enable at least one service by setting its environment `API_KEY`

```bash
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
export STABILITY_API_KEY=sk-...
export REPLICATE_API_KEY=sk-....
export MISTRAL_API_KEY=...
```



## Usage

The default interface is text. `AI.js` lets you send one-off requests or build up complex message histories with the Large Language Model (LLM).

```javascript
const AI = require("@themaximalist/ai.js");
await AI("what is the codeword?"); // i don't know any codewords

const ai = new AI("the codeword is blue");
await ai.chat("what is the codeword?"); // blue
```



## System and User Prompts

Giving the `LLM` a role can help improve performance, this can be done through `system` and `user` prompts.

```javascript
const ai = new AI();
ai.system("I am HexBot—I generate beautiful hex color schemes");
await ai.chat("autumn tree");
// #663300 (dark brown), #CC6600 (deep orange), #FF9900 (bright orange), #FFCC00 (golden yellow), #663399 (deep purple)
await ai.chat("make it lighter");
// #885533 (light brown), #FF9933 (pale orange), #FFCC66 ( light orange), #FFEE99 (pale yellow), #9966CC (light purple)
```



## Message History

Chat history can build up over time, or you can initialize with an existing history.

```javascript
await AI([
    { role: "user", content: "remember the secret codeword is blue" },
    { role: "user", content: "what is the secret codeword I just told you?" },
]); // blue
```
Or initialize with an existing history, and continue the conversation.

```javascript
const ai = new AI([
    { role: "user", content: "remember the secret codeword is blue" },
    { role: "user", content: "what is the secret codeword I just told you?" },
]);
await ai.send(); // blue
await ai.chat("now the codeword is red");
await ai.chat("what is the codeword?"); // red
```

All message formats between LLaMa, Anthropic and OpenAI use this format and `AI.js` automatically translates for each service.



## Streaming

Streaming is as easy as passing `{stream: true}` as the second options parameter. A generator is returned that yields the completion tokens in real-time.

```javascript
const stream = await AI("the color of the sky is", { stream: true });
for await (const message of stream) {
    process.stdout.write(message);
}
```



## Image Generation

`AI.js` provides powerful image generation functions through `Automatic1111`, `StabilityAI` and `Replicate`. Make sure you have each service setup as needed, either running or a valid environment variable.

```javascript
await AI.Image("a red rose"); // <image buffer: red rose>
```

`AI.js` also provides a concept generator—a way of using chat completion to generate a great image prompt. Using a concept generator can result in significantly better generated images.

```javascript
await AI.Image.Concept("a red rose"); // {prompt: a red rose in realist style, watercolor ...", <image buffer>}
```

This hits your `LLM` provider and generates a complex image prompt before sending it off to the image generation service. 



## Environment Variables

`AI.js` supports configuration through environment variables.

##### Configure API keys

```bash
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
export STABILITY_API_KEY=sk-...
export REPLICATE_API_KEY=sk-....
export MISTRAL_API_KEY=...
```



## Documentation

`AI.js` includes many sub-projects, check out each individual project for full documentation.

* [LLM.js](https://llmjs.themaximalist.com) — Simple interface to dozens of Large Language Models
* [Imagine.js](https://github.com/themaximal1st/imagine.js) — Local and remote image generation library
* [Embeddings.js](https://github.com/themaximal1st/embeddings.js) — Simple local or OpenAI text embeddings
* [VectorDB.js](https://github.com/themaximal1st/vectordb.js) — Local text similarity search



## Projects

`AI.js` is currently used in the following projects:

-   [Infinity Arcade](https://infinityarcade.com) — Play any text adventure game



## Author

-   [The Maximalist](https://themaximalist.com/)
-   [@themaximal1st](https://twitter.com/themaximal1st)



## License

MIT

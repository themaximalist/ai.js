## AI.js

<img src="public/logo.png" alt="AI.js — AI Toolkit for Node.js" class="logo" style="max-width: 300px;" />

<div class="badges" style="text-align: center; margin-top: 0px;">
<a href="https://github.com/themaximal1st/ai.js"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/themaximal1st/ai.js"></a>
<a href="https://www.npmjs.com/package/@themaximalist/ai.js"><img alt="NPM Downloads" src="https://img.shields.io/npm/dt/%40themaximalist%2Fai.js"></a>
<a href="https://github.com/themaximal1st/ai.js"><img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/themaximal1st/ai.js"></a>
<a href="https://github.com/themaximal1st/ai.js"><img alt="GitHub License" src="https://img.shields.io/github/license/themaximal1st/ai.js"></a>
</div>
<br />

`AI.js` is the easiest way to add AI text, images, embeddings and vector search to your Node.js app.

```javascript
await AI("the color of the sky is"); // blue

await AI.Image("a red rose"); // <image buffer: red rose>

await AI.Image.Concept("a red rose"); // {prompt: a red rose in realist style, watercolor ...", <image buffer>}

await AI.Embeddings("hello world"); // Array(384)

const db = new AI.VectorDB();
await db.add("red");
await db.add("blue");
await db.search("redish") // red
```

Under the hood `AI.js` seamlessly integrates easy to use local and remote APIs

* **Text:** [LLM.js](https://llmjs.themaximalist.com) use `GPT-4`, `Gemini`, `Claude`, `Mistral` or `LLaMa` in same simple interface
* **Image:** [Imagine.js](https://imaginejs.themaximalist.com/) supports local `Stable Diffusion` and remote services like `Replicate` and `Stability AI`
* **Embeddings:** [Embeddings.js](https://embeddingsjs.themaximalist.com/) create `local`, `OpenAI` or `Mistral` embeddings
* **VectorDB:** [VectorDB.js](https://vectordbjs.themaximalist.com/) searches similar embeddings in memory
* **Audio:** *Coming Soon*
* **Video:** *Coming Soon*

## Features

* Easy to use
* Same simple interface for hundreds of models (OpenAI, Google, Anthropic, Mistral, LLaMa, Replicate, Stability AI, Hugging Face and more)
* Works locally and offline by default!
* Offers best-in-class options through remote APIs
* Advanced LLM features like one-shot prompts, chat history, streaming and JSON schema and more
* Image generation using the best open and paid models
* Image concepts to easily combine LLMs with Image generators for impressive results
* Easy to use text embeddings and in-memory vector search
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
export GOOGLE_API_KEY=sk-ant-...
export STABILITY_API_KEY=sk-...
export REPLICATE_API_KEY=sk-....
export MISTRAL_API_KEY=...
```



## LLM 

The default interface is text. `AI.js` lets you send one-off requests or build up complex message histories with the Large Language Model (LLM).

```javascript
const AI = require("@themaximalist/ai.js");
await AI("what is the codeword?"); // i don't know any codewords

const ai = new AI("the codeword is blue");
await ai.chat("what is the codeword?"); // blue
```

The default `AI.js` mode is `LLM`, and is running on top of [LLM.js](https://llmjs.themaximalist.com). Please see that site for full documentation, that also applies to `AI.js`.

There are many features supported across dozens of popular models, like streaming, JSON support, max_tokens, temperature, seed and more.

## Images

`AI.js` provides powerful image generation functions through `Automatic1111`, `StabilityAI` and `Replicate`. Make sure you have each service setup as needed, either running locally or a valid environment variable.

```javascript
const image = await AI.Image("a red rose");
fs.writeFileSync("rose.png", image);
```

See [Imagine.js](https://imaginejs.themaximalist.com/) for all image generator documentation.

### Imagine Concepts

`AI.js` also provides a concept generator—a way of using LLMs together with image generators.

```javascript
const { prompt, buffer } = await AI.Image.Concept("a red rose");
console.log(prompt); // a red rose in realist style, watercolor ..."
fs.writeFileSync("complex-rose.png", buffer);
```

This hits your `LLM` provider and generates a complex image prompt before sending it off to the image generation service. 

## Embeddings

`AI.js` let's you easily generate local or remote embeddings using `Embeddings.js`.

```javascript
const embeddings = await AI.Embeddings("hello world"); // embedding array
```

It works with local embeddings, OpenAI and Mistral.

Embeddings can be used in any vector database like Pinecone, Chroma, PG Vector, etc...

See [Embeddings.js](https://embeddingsjs.themaximalist.com/) for all options.

## Vector Search

`AI.js` let's you quickly find similar text strings using a vector database.

It runs in-memory and can use embeddings from `AI.js`.

To find similar strings, add a few to the database, and then search.

```javascript
const db = new AI.VectorDB();

await db.add("orange");
await db.add("blue");

const result = await db.search("light orange");
// [ { input: 'orange', distance: 0.3109036684036255 } ]
```

See [VectorDB.js](https://vectordbjs.themaximalist.com/) for full documentation.


## API

`AI.js` includes these sub-projects:

* [LLM.js](https://llmjs.themaximalist.com) — Simple interface to dozens of Large Language Models
* [Imagine.js](https://imaginejs.themaximalist.com) — Local and remote image generation library
* [Embeddings.js](https://embeddingsjs.themaximalist.com) — Simple local or OpenAI text embeddings
* [VectorDB.js](https://vectordbjs.themaximal1st.com) — Local text similarity search

Check out each individual project for full API documentation.

They can be used individually or together like in `AI.js`.

## Debug

`AI.js` uses the `debug` npm module across all of it's sub-projects.

The namespace is the lowercase version of the project name.

View debug logs by setting the `DEBUG` environment variable.

```bash
> DEBUG=llm.js*
> node src/run_ai.js
# debug logs
```

You can combine multiple logs with a comma.

```bash
> DEBUG=llm.js*,imagine.js*,embeddings.js*,vectordb.js*
> node src/run_ai.js
# debug all logs
```



## Projects

`AI.js` is currently used in the following projects:

-   [Infinity Arcade](https://infinityarcade.com) — Play any text adventure game
-   [News Score](https://newsscore.com) — score and sort the news
-   [AI Image Explorer](https://aiimageexplorer.com) — image explorer
-   [Think Machine](https://thinkmachine.com) — AI research assistant
-   [Thinkable Type](https://thinkabletype.com) — Information Architecture Language
-   [Minds App](https://mindsapp.com) — AI chat in your menubar


## License

MIT


## Author

Created by [The Maximalist](https://twitter.com/themaximal1st), see our [open-source projects](https://themaximalist.com/products).


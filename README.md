# AI.js

`AI.js` is the easiest way to add AI text and image capabilities to your node applications:

```javascript
await AI("the color of the sky is"); // blue

await AI.Image("a red rose"); // <image buffer: red rose>
```

Under the hood `AI.js` seamlessly integrates all the best AI APIs:

* **Text**: OpenAI, Anthropic
* **Image**: Replicate, StabilityAI
* **Music:** *Coming Soon*
* **Video:** *Coming Soon*
* **Embeddings:** *Coming Soon*

We're constantly looking for new models and APIs to add. In a future update, `AI.js` will support local models like `Stable Diffusion` and `LLaMA/Alpaca` with the same easy-to-use interface.

*AI.js is under heavy development and still subject to breaking changes.*



## Features

* Easy to use
* Best LLM chat completion models (`gpt-3.5-turbo`, `gpt-4`, `claude-v1`, `claude-instant-v1`)
* Best hosted image generation APIs (`stable-diffusion-xl-beta-v2-2-2`, many other Stable Diffusion models)
* Same interface across all services
* Streaming is easy as `{stream: true}`
* `ai` CLI interface in your shell
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
```



## Usage

The default interface is text. `AI.js` lets you send one-off requests or build up complex message histories with the Large Language Model (LLM).

```javascript
const AI = require("@themaximalist/ai.js");
await AI("what is the codeword?"); // i don't know any codewords

const ai = new AI("the codeword is blue");
await ai.chat("what is the codeword?"); // blue
```



### System and User Prompts

Giving the `LLM` a role can help improve performance, this can be done through `system` and `user` prompts.

```javascript
await AI.system("I am HexBot—I generate beautiful hex color schemes", "autumn tree");
// #F2AF80 (soft peach), #E78C4D (burnt orange), #C86018 (rusty red), #5B3B0B (deep brown), #252527 (dark grey)
```

OpenAI has mentioned `user` prompts may be more strongly enforced than `system` prompts.

```javascript
await AI.user("You are HexBot—you generate beautiful hex color schemes", "autumn tree");
// #F2AF80 (soft peach), #E78C4D (burnt orange), #C86018 (rusty red), #5B3B0B (deep brown), #252527 (dark grey)
```

Providing `system` and `user` roles can also be used with message history.

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

Note: Anthropic's message format is text-based and less convenient, so `AI.js` uses the OpenAI message format, and it's converted automatically on-the-fly for Anthropic.



### Streaming

Streaming is as easy as passing `{stream: true}` as the second options parameter. A generator is returned that yields the completion tokens in real-time.

```javascript
const stream = await AI("the color of the sky is", { stream: true });
for await (const message of stream) {
    process.stdout.write(message);
}
```



### AI() Interface

The `AI()` interface is the same whether you're using `new` or `await`. Also `options` aim to be the same everywhere you can pass them, and use the most local scope possible, falling back to more global defaults and environment variables when needed.

```javascript
await|new AI(
    string | array,
    options = {
        service: "openai", // openai, anthropic
        model: "gpt-3.5-turbo", // gpt-3.5-turbo, gpt-4, claude-v1, claude-instant-v1
        parser: null, // optional content parser or stream parser
        stream: false,
        context: AI.CONTEXT_FULL, // slices of message history can be sent, but by default send everything
    }
);
```



* **Static Methods**
  * `AI.system(prompt, input, option=null)` one-time use system prompt
  * `AI.user(prompt, input, options=null`) one-time use user prompt

* **Instance Methods**
  * `ai.send(options=null)` send chat completion request to network
  * `ai.chat(content, options=null)` add user message and send chat completion request to network
  * `ai.user(content)` add user message
  * `ai.system(content)` add system message
  * `ai.assistant(content)` add assistant message
  * `ai.messages[]` message history
  * `ai.lastMessage` last message



## Image Generation

`AI.js` provides powerful image generation functions through `StabilityAI` and `Replicate`. To get started, make sure you've set the `STABILITY_API_KEY` or `REPLICATE_API_KEY` environment variable.

```javascript
await AI.Image("a red rose"); // <image buffer: red rose>
```

`AI.js` also provides a concept generator—a way of using chat completion to generate a great image prompt.

```javascript
await AI.Image.Concept("a red rose"); // <image buffer: a red rose in realist style, watercolor>
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
```

##### Configure Service

```bash
export AI_SERVICE=openai
export AI_SERVICE=anthropic

export AI_IMAGE_SERVICE=stability
export AI_IMAGE_SERVICE=replicate
```

##### Configure Model

```bash
export AI_MODEL=gpt-3.5-turbo
export AI_MODEL=gpt-4
export AI_MODEL=claude-v1
export AI_MODEL=claude-instant-v1

export AI_IMAGE_MODEL=stable-diffusion-xl-beta-v2-2-2
```

`AI.js` will make some effort to make sure the right models are used with the right service if no defaults are set. So you can switch to `anthropic` and `AI.js` will automatically use `claude-v1`.



## `AI` Command in your Shell

`AI.js` provides a handy `ai` command that can be invoked from your shell. This is an extremely convenient way to call models and services with the full power of `AI.js`. Access it globally by installing `npm install @themaximalist/ai.js -g` or setting up an `nvm` environment.

```bash
> ai the color of the sky is
blue
```

Messages are streamed back in real time.

You can also initiate a `--chat` to remember message history and continue your conversation. `Ctrl-C` to quit.

```bash
> ai remember the codeword is blue. say ok if you understand --chat
OK, I understand.
> what is the codeword?
The codeword is blue.
```

Model and service can be specified on the fly

```bash
> ai the color of the sky is --service anthropic --model claude-v1
blue
```

Or `ai` will fallback to `$AI_SERVICE` and `$AI_MODEL` environment variables.

```bash
> export AI_SERVICE=anthropic
> export AI_MODEL=claude-v1
> ai the color of the sky is
blue # claude-v1 response
```

Here's the help interface

```bash
> ai
Usage: ai [options] [input]

Simple AI interface to gpt-3.5-turbo, gpt-4 and Claude

Arguments:
  input                    Input to send to AI service

Options:
  -V, --version            output the version number
  -s, --service <service>  AI Service (default: "openai")
  -m, --model <model>      Completion Model (default: "gpt-3.5-turbo")
  -c, --chat               Chat Mode
  -h, --help               display help for command
```



## Debug

`AI.js` and `ai` use the `debug` npm module with the `ai.js` namespace, so you can view debug logs by setting the `DEBUG` environment variable.

```bash
> DEBUG=ai.js:* ai the color of the sky is
# debug logs
blue
> export DEBUG=ai.js:*
> ai the color of the sky is
# debug logs
blue
```



## Examples

View [examples](https://github.com/themaximal1st/ai.js/tree/main/examples) on how to use `AI.js`.



## Projects

`AI.js` is currently used in the following projects:

-   [Infinity Arcade](https://infinityarcade.com)



## Author

-   [The Maximalist](https://themaximalist.com/)
-   [@themaximal1st](https://twitter.com/themaximal1st)



## License

MIT

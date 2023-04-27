# AI.js

![GitHub](https://img.shields.io/github/license/themaximal1st/ai.js)
![npm](https://img.shields.io/npm/dw/themaximal1st/ai.js)
![GitHub Repo stars](https://img.shields.io/github/stars/themaximal1st/ai.js?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/themaximal1st?style=social)

**`AI.js`** is the simplest way to interact with Large Language Models (AI) like OpenAI's `gpt-3.5-turbo`, `gpt-4`, and Anthropic's `Claude`. It offers a convenient interface for developers to use different AIs in their Node.js projects.

```javascript
await AI("the color of the sky is"); // blue
```

**Features**

-   Easy to use
-   Same simple interface for all services (`openai` and `anthropic` supported)
-   Automatically manage chat history
-   Streaming made easy
-   Manage context window size
-   CLI interface to use anywhere in the shell
-   MIT license

_AI.js is under heavy development and still subject to breaking changes._

## Install

Make sure you have `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` set in your environment variables.

```bash
npm install @themaximalist/ai.js
export OPENAI_API_KEY=...
```

## Usage

### Simple completion

The simplest way to call `AI.js` is directly as an `async function`, using a `string` as a parameter. This performs a single request and doesn't store any history.

```javascript
const AI = require("@themaximalist/ai.js");
await AI("hello"); // Response: hi
```

### Completion with history

Storing history is as simple as initializing with `new AI()`. Call `fetch()` to send the current state for completion, and `chat()` to update the messages and fetch in one command. Both chats from the `user` and responses from the AI `assistant` are stored automatically.

```javascript
const ai = new AI("what's the color of the sky in hex value?");
await ai.fetch(); // Response: sky blue
await ai.chat("what about at night time?"); // Response: darker value (uses previous context to know we're asking for a color)
```

### System prompts

Create agents that specialize at specific tasks using `AI.system(prompt, input)`. Note OpenAI has suggested system prompts may not be
as effective as user prompts (`AI.user(prompt, input)`). These are one-time use AI's because they don't store the message history.

```javascript
await AI.system("I am HexBot, I imagine colors and return hex values", "sky"); // Response: sky blue
await AI.system(
    "I am HexBot, I imagine colors and return hex values",
    "sky at night"
); // Response: darker
```

### System prompts with history

Storing message history with system prompts is easy—just initialize a `new AI()` and call `system()` to initialize a system prompt. A network request is not sent until `fetch()` or `chat()` is called—so you can build up examples for the AI with a combination of `system()`, `user()`, and `assistant()`—or keep an agent running for a long time with context of previous conversations.

```javascript
const ai = new AI();
ai.system("I am HexBot, I imagine colors and return hex values");
await ai.chat("sky"); // Response: sky blue
await ai.chat("lighter"); // Response: lighter sky blue (has previous context to know what we mean)
```

Here's a user prompt example:

```javascript
const ai = new AI();
ai.user("remember the secret codeword is blue");
await ai.chat("what is the secret codeword I just told you?"); // Response: blue
ai.user("now the codeword is red");
await ai.chat("what is the secret codeword I just told you?"); // Response: red
await ai.chat("what was the first secret codeword I told you?"); // Response: blue
```

### Streaming completions

Streaming is as easy as passing `{stream: true}` as the second options parameter. A generator is returned that yields the completion tokens in real-time.

```javascript
const stream = await AI("the color of the sky is", { stream: true });
for await (const message of stream) {
    process.stdout.write(message);
}
```

### Messages with simple interaction

So far every input to `AI()` has been a `string`, but you can also send an array of previous messages. The same `await AI()`/`new AI()` interface works as expected, as does streaming, etc...

```javascript
await AI([
    { role: "user", content: "remember the secret codeword is blue" },
    { role: "user", content: "what is the secret codeword I just told you?" },
]); // Response: blue
```

Note, the OpenAI message data format is used for all models. Anthropic uses a text-based "Human: text\n\nAssistant: text" format which is isn't as convenient—so Claude messages are converted automatically on-the-fly.

## Fetch Context

When sending message history for completion, managing long conversations will eventually run into a size limit. There are a few helpful `context` options you can pass into `fetch()`.

```javascript
const ai = new AI([...]);
await ai.fetch({context: AI.CONTEXT_FIRST}); // send first message
await ai.fetch({context: AI.CONTEXT_LAST}); // send last message
await ai.fetch({context: AI.CONTEXT_OUTSIDE}); // send first and last messages
await ai.fetch({context: AI.CONTEXT_FULL}); // send everything (default)
```

## API

The simplest interface to `AI.js` is calling `await AI()`

```javascript
await AI(
    string | array,
    options = {
        service: "openai", // openai, anthropic
        model: "gpt-3.5-turbo", // gpt-3.5-turbo, gpt-4, claude-v1, claude-instant-v1
        parser: null, // optional content parser or stream parser
        stream: false,
    }
);
```

To store message history, call `new AI()` to initiate the `AI` object—the interface and options are the same.

```javascript
new AI(
    string | array,
    options = {
        service: "openai", // openai, anthropic
        model: "gpt-3.5-turbo", // gpt-3.5-turbo, gpt-4, claude-v1, claude-instant-v1
        parser: null, // optional content parser or stream parser
        stream: false,
    }
);
```

#### AI() Instance Methods

-   **AI.fetch({context: AI.CONTEXT_FULL, stream: false, parser: null, model: default})** send network request for completion. See `context` docs above
    and [Infinity Arcade](https://github.com/themaximal1st/InfinityArcade/blob/main/src/services/parseTokenStream.js) for a custom stream parser implementation. `parser` can also be something
    like `JSON.parse()` when not streaming. `AI.parseJSONFromText` can also be used as a lenient JSON parser.
-   **AI.user(content)** add user content
-   **AI.system(content)** add system content
-   **AI.assistant(content)** add assistant content
-   **AI.chat(content, options)** add user content and send `fetch`
-   **AI.messages[]** message history
-   **AI.lastMessage**

#### AI() Static Methods

-   **AI.system(prompt, input, options)** helper for one-time use system prompt
-   **AI.user(prompt, input, options)** helper for one-time use user prompt

#### AI.js Options

`AI.js` attempts to use similar interfaces everywhere.

-   Initialize default options with environment variables
-   Initialize in `await AI(options)` or `new AI(options)`
-   Set `ai.fetch(options)` per request
-   Set `ai.chat(input, options)` per chat request

`AI.js` will use whatever you specify, and fallback to a more global default if not set.

## Environment Variables

`AI.js` supports configuration through environment variables.

##### Configure API keys

```bash
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
```

##### Configure Service

```bash
export AI_SERVICE=openai
export AI_SERVICE=anthropic
```

##### Configure Model

```bash
export AI_MODEL=gpt-3.5-turbo
export AI_MODEL=gpt-4
export AI_MODEL=claude-v1
export AI_MODEL=claude-instant-v1
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

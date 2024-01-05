
import LLM from "@themaximalist/llm.js";
import Imagine from "@themaximalist/imagine.js";
import Embeddings from "@themaximalist/embeddings.js";
import VectorDB from "@themaximalist/vectordb.js";

LLM.Imagine = Imagine;
LLM.Embeddings = Embeddings;
LLM.VectorDB = VectorDB;

export default LLM;

// const AI = require("./llm");

// AI.Image = require("./image");

// module.exports = AI;

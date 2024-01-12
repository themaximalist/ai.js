
import LLM from "@themaximalist/llm.js";
import Imagine from "@themaximalist/imagine.js";
import Embeddings from "@themaximalist/embeddings.js";
import VectorDB from "@themaximalist/vectordb.js";
import Concept from "./concept.js";

LLM.Imagine = Imagine;
LLM.Imagine.Concept = Concept;
LLM.Embeddings = Embeddings;
LLM.VectorDB = VectorDB;

export default LLM;

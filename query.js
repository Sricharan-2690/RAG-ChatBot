import * as dotenv from 'dotenv';
dotenv.config();

import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const History = [];

/* ------------------------------------------------------
   1. Query Rewriting (Standalone Question Generator)
------------------------------------------------------ */
async function transformQuery(question) {
  History.push({
    role: 'user',
    parts: [{ text: question }]
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `
        You are a query rewriting expert.
        Rewrite the "Follow Up user Question" into a complete, standalone question.
        Do NOT include any explanation. Just return the rewritten question only.
      `
    },
  });

  History.pop(); // remove rewrite request from history
  return response.text.trim();
}

/* ------------------------------------------------------
   2. Main Chat Function (RAG Flow)
------------------------------------------------------ */
async function chatting(question) {

  // Step 1 → Rewrite query
  const rewrittenQuery = await transformQuery(question);

  // Step 2 → Convert rewritten query into embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
  });

  const queryVector = await embeddings.embedQuery(rewrittenQuery);

  // Step 3 → Connect to Pinecone
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  // Step 4 → Search similar chunks
  const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
  });

  // Step 5 → Build context for LLM
  const context = searchResults.matches
    .map(match => match.metadata.text)
    .join("\n\n---\n\n");

  // Step 6 → Inject context + ask Gemini
  History.push({
    role: 'user',
    parts: [{ text: rewrittenQuery }]
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `
        You are a Data Structures & Algorithms expert.
        
        Answer ONLY using the context below.
        If answer is missing in the context, respond exactly:
        "I could not find the answer in the provided document."

        --------------------------
        CONTEXT:
        ${context}
        --------------------------
      `
    }
  });

  // Store model response in chat history
  History.push({
    role: 'model',
    parts: [{ text: response.text }]
  });

  console.log("\n");
  console.log(response.text);
}

/* ------------------------------------------------------
   3. CLI Loop
------------------------------------------------------ */
async function main() {
  const userProblem = readlineSync.question("Ask me anything --> ");
  await chatting(userProblem);
  main(); // infinite loop
}

main();
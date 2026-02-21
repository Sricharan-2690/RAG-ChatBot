import * as dotenv from "dotenv";
dotenv.config();

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";

// 1) Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini embedding model (GA): gemini-embedding-001 [web:51][web:57]
const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});

// 2) Helper: embed one text, force dim = 768
async function embedText(text) {
  // Gemini expects a Content object: { parts: [{ text: "..." }] } [web:55]
  const res = await embeddingModel.embedContent({
    content: {
      parts: [{ text }],
    },
    taskType: "RETRIEVAL_DOCUMENT",
    // Reduce dimensionality to 768 to match your Pinecone index. [web:55][web:57]
    outputDimensionality: 768,
  });

  // Your debug output shows the shape is res.embedding.values
  if (!res.embedding || !res.embedding.values) {
    throw new Error("Embedding missing in response.");
  }

  let vec = res.embedding.values;

  // Safety: ensure 768 dims
  if (vec.length > 768) vec = vec.slice(0, 768);
  if (vec.length < 768) vec = vec.concat(Array(768 - vec.length).fill(0));

  return vec;
}

async function indexDocument() {
  try {
    console.log("🚀 Starting indexing...");

    // 3) Load PDF
    const PDF_PATH = "./dsa.pdf";
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();
    console.log(`📄 PDF loaded, pages: ${rawDocs.length}`);

    // 4) Chunking
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    console.log(`✂️  Created chunks: ${chunkedDocs.length}`);

    // 5) Pinecone
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.index(process.env.PINECONE_INDEX_NAME);
    console.log("✅ Pinecone index connected (dim must be 768)");

    // 6) Embed + upsert in batches
    const BATCH_SIZE = 10;
    let total = 0;

    for (let i = 0; i < chunkedDocs.length; i += BATCH_SIZE) {
      const batch = chunkedDocs.slice(i, i + BATCH_SIZE);

      const pineconeVectors = [];
      for (let j = 0; j < batch.length; j++) {
        const doc = batch[j];
        const text = doc.pageContent;

        const vector = await embedText(text);

        if (!vector || vector.length !== 768) {
          console.log(
            `⚠️ Skipping chunk ${i + j}, embedding dim: ${
              vector ? vector.length : 0
            }`
          );
          continue;
        }

        pineconeVectors.push({
          id: `chunk-${i + j}`,
          values: vector,
          metadata: {
            text,
          },
        });
      }

      if (pineconeVectors.length > 0) {
        await index.upsert(pineconeVectors);
        total += pineconeVectors.length;
        console.log(
          `⬆️  Upserted ${total}/${chunkedDocs.length} (this batch: ${pineconeVectors.length})`
        );
      }
    }

    console.log("🎉 Data stored successfully in Pinecone");
  } catch (err) {
    console.error("❌ Indexing error:", err);
  }
}

indexDocument();

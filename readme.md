# 📄 Document Retrieval Chatbot (RAG)

A Retrieval-Augmented Generation chatbot that answers questions directly from PDF documents using semantic search, embeddings, and context-aware generation.

---

## 📚 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Important Parameters](#important-parameters)
- [Why This Project Matters](#why-this-project-matters)
- [Author](#author)

---

## Overview

This chatbot uses a RAG pipeline to:

- Read and chunk PDFs  
- Convert chunks into embeddings  
- Store them in Pinecone  
- Retrieve the top relevant chunks  
- Inject context into Gemini Flash  
- Answer strictly from the document (no hallucination)

---

## Tech Stack

**Node.js, LangChain, Pinecone, Google Gemini Flash, GoogleGenerativeAIEmbeddings, text-embedding-004, PDFLoader, RecursiveCharacterTextSplitter, PineconeStore, dotenv, readline-sync, pdf-parse**

---

## Features

- PDF ingestion & chunking (**chunkSize = 1000**, **chunkOverlap = 200**)  
- Embedding generation using **text-embedding-004**  
- Vector storage in Pinecone (**maxConcurrency = 5**)  
- Query rewriting + semantic retrieval (**top-K = 10**)  
- Context-based Gemini Flash answers  
- Fully interactive CLI chatbot  

---
## Architecture

PDF → Chunking → Embeddings → Pinecone Index
Query → Embed → Vector Search (top-K=10) → Context → Gemini Flash → Answer


---

## Project Structure
📁 Document-Retrieval-Chatbot
│── index.js # PDF → chunks → embeddings → Pinecone
│── query.js # Query rewriting + retrieval + LLM
│── dsa.pdf
│── .env
│── package.json
│── README.md

---

## Setup

###
1️⃣ Install Dependencies
```bash
npm install
2️⃣ Add Environment Variables

Create .env:
GEMINI_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=your_index
3️⃣ Add Your PDF

Place:

dsa.pdf
Usage
Step 1 — Index Document
node index.js
Step 2 — Start Chatbot
node query.js

Example:

Ask me anything --> What is a linked list?
Important Parameters
Component	Value
Chunk Size	1000
Chunk Overlap	200
Embedding Model	text-embedding-004
Pinecone Concurrency	5
Retrieval Size	top-K = 10
Why This Project Matters

Complete, real-world RAG implementation

Uses industry tools: Pinecone + Gemini

Prevents hallucination using strict context

Demonstrates ML engineering & vector search skills

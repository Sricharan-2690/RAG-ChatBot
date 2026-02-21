# 📄 Document Retrieval Chatbot (RAG)

A Retrieval-Augmented Generation chatbot that answers queries directly from PDF documents using semantic search, embeddings, and context-aware generation.

## 🚀 Overview

Document Retrieval Chatbot (RAG) is a CLI-based AI assistant that:

- Loads and reads PDF documents  
- Splits them into semantic chunks  
- Generates embeddings using Google text-embedding-004  
- Stores vector embeddings in Pinecone  
- Retrieves top-K relevant chunks for every query  
- Injects context into Gemini Flash for accurate answers  
- Prevents hallucinations by answering strictly from the document  

This project demonstrates a complete RAG pipeline — indexing + retrieval + augmented generation.

## 🛠️ Tech Stack

- Node.js  
- LangChain  
- Google Gemini Flash  
- GoogleGenerativeAIEmbeddings  
- Pinecone Vector Database  
- PDFLoader  
- RecursiveCharacterTextSplitter  
- PineconeStore  
- dotenv  
- readline-sync  
- pdf-parse  

## 📌 Key Features

### 1. Document Indexing Pipeline
- Splits PDFs into 1000-character chunks  
- Uses 200 overlap for semantic continuity  
- Converts chunks into embeddings using text-embedding-004  
- Uploads embeddings to Pinecone with maxConcurrency = 5  

### 2. Query Processing & Retrieval
- Rewrites follow-up questions into standalone questions  
- Converts user query into embedding  
- Performs top-K = 10 similarity search  
- Extracts relevant chunks  
- Builds a structured context block  

### 3. LLM Response Generation
- Sends rewritten query + context to Gemini Flash  
- Answers are based ONLY on the provided context  
- If context missing → returns: "I could not find the answer in the provided document."

### 4. Interactive CLI Chatbot
- Continuous loop  
- History-aware query rewriting  
- Terminal-based Q&A  

## 📂 Project Structure

```
📁 Document-Retrieval-Chatbot
│── index.js
│── query.js
│── dsa.pdf
│── .env
│── package.json
│── README.md
```

## 🔧 Setup Instructions

### Clone the Repository
```
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### Install Dependencies
```
npm install
```

### Add Environment Variables
Create a `.env` file:

```
GEMINI_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=your_index
```

### Add Your PDF File
Place your file:
```
dsa.pdf
```

## 🚀 Usage

### Step 1 — Index the Document
```
node index.js
```

Output:
```
PDF loaded
Chunking Completed
Embedding model configured
Pinecone configured
Data Stored successfully
```

### Step 2 — Start the Chatbot
```
node query.js
```

Example:
```
Ask me anything --> What is a linked list?
```

## 🧩 RAG Flow

PDF → Chunks → Embeddings → Pinecone → Query Vector → Similarity Search → Context → Gemini Flash → Answer  

## 🏗️ Important Parameters

| Component | Value |
|----------|-------|
| Chunk Size | 1000 |
| Chunk Overlap | 200 |
| Embedding Model | text-embedding-004 |
| Pinecone Concurrency | 5 |
| Retrieval Count | top-K = 10 |

## 🛡️ Hallucination Prevention

Model instructed to answer ONLY from context or return:  
"I could not find the answer in the provided document."

## 📈 Why This Project Matters

- Demonstrates a full RAG pipeline  
- Uses Pinecone + Gemini  
- Shows real understanding of retrieval systems  
- Great for ML/AI portfolios  

## 📜 License
MIT License

## 🙌 Author
Sri Charan  
AI Developer & Computer Science Student  
Osmania University

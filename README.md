# GBunT - Coffee Chatbot

A bilingual (Arabic/English) AI chatbot specialized in coffee knowledge using RAG (Retrieval-Augmented Generation).

## How It Works

### RAG Architecture

This chatbot uses **Retrieval-Augmented Generation (RAG)** to provide accurate, context-aware responses about coffee:

1. **Knowledge Base**: Coffee knowledge is stored in two markdown files:
   - `coffee_knowledge_ar.md` - Arabic knowledge
   - `coffee_knowledge_en.md` - English knowledge

2. **Context Retrieval**: When a user sends a message, the system:
   - Detects the language (Arabic or English)
   - Loads the appropriate knowledge file
   - Injects the full knowledge content into the AI's system prompt

3. **AI Generation**: The AI model uses this context to generate accurate responses based on the provided knowledge.

### AI Model

- **Provider**: TogetherAI
- **Model**: `deepseek-ai/DeepSeek-V4-Pro`

The model is chosen for its:
- Strong Arabic capabilities
- Serverless availability (no dedicated endpoint needed)
- Cost-effectiveness

## Quick Start

### Prerequisites

- Node.js (v18+)
- TogetherAI API Key from [https://api.together.xyz/](https://api.together.xyz/)

### Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Add your TOGETHER_API_KEY to .env
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```
## Tech Stack

- **Frontend**: React.js + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js
- **AI**: TogetherAI (deepseek-ai/DeepSeek-V4-Pro)
- **RAG**: Direct markdown file injection into system prompt

---
*Developed with ❤️ & ☕ by **Khaled-Alabadla***

# Crystal Ball Command Centre — Approvals AI Assistant
> **Senior Fullstack Developer — MERN + AI | Wave 2 Technical Assignment**  
> High-fidelity digital-twin operator approvals console featuring an embedded, resilient AI Copilot backed by server-side LLM inference, structured schema validation, in-memory RAG, and token-by-token streaming.

---

## 📸 Overview & Architecture

This repository contains the end-to-end implementation of OomniEye's digital-twin Approvals workspace and its lower-right AI Assistant panel. Every action is wired to a genuine server-side AI decision layer designed for operational resilience.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 14 FRONTEND                             │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │ Dashboard / Approvals Table   │  │ Approvals Assistant Widget     │ │
│  │ - Queue View / Hierarchy View │  │ - Present me Summary (TTS/JSON)│ │
│  │ - 4 Mock Queue Items          │  │ - Talk to me (SSE Streaming)   │ │
│  │ - Screen Snapshot Target View │  │ - Help me (RAG Grounded Q&A)   │ │
│  │ - Zustand State Management    │  │ - Teach me (4-Step Mentorship) │ │
│  └──────────────┬────────────────┘  │ - Replay Greeting (Dynamic)    │ │
│                 │                   └───────────────┬────────────────┘ │
└─────────────────┼───────────────────────────────────┼──────────────────┘
                  │ HTTP / REST                       │ SSE / REST (Zod validated)
┌─────────────────▼───────────────────────────────────▼──────────────────┐
│                     EXPRESS + TYPESCRIPT BACKEND                       │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │ Middlewares & Validation      │  │ Versioned Prompts (/prompts)   │ │
│  │ - Zod Request/Response Schema │  │ - Summary v1.0, Talk v1.0      │ │
│  │ - Express Rate Limiting (60/m)│  │ - Help v1.0, Teach v1.0        │ │
│  │ - 8-Second Timeout Guard      │  │ - Greeting v1.0                │ │
│  └──────────────┬────────────────┘  └───────────────┬────────────────┘ │
│                 │                                   │                  │
│  ┌──────────────▼───────────────────────────────────▼────────────────┐ │
│  │ Resilient LLM Service Layer                                       │ │
│  │ - Provider Factory (Anthropic Claude / OpenAI / High-Fi Mock)     │ │
│  │ - In-Memory RAG Engine (BM25 Term Overlap over 4 Policy Chunks)   │ │
│  │ - Graceful Degradation Engine (Zero-500 fallback guarantee)       │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI-Necessary vs. AI-Unnecessary Analysis (JD Section 5)

| Entry Point | Classification | Architectural Justification & Fallback |
|---|---|---|
| **Present me Summary** | **AI-Necessary** | Multi-attribute urgency synthesis across heterogeneous file formats (CAD layouts, 4K drone footage, vibration telemetry) requires semantic risk modeling that static SQL `ORDER BY` cannot capture. **Fallback:** Heuristic priority sort on pre-computed criticality tags. |
| **Talk to me** | **AI-Necessary** | Open-ended, multi-turn operator inquiries ("*which of these needs my attention first and why?*") require natural-language intent recognition and dynamic context extraction across the active queue. **Fallback:** Deterministic briefing on pending CRITICAL items. |
| **Help me** | **AI-Hybrid (RAG)** | Pure general-knowledge LLMs hallucinate site rules; classical search returns disjointed keywords. A grounded RAG approach over curated policy chunks guarantees compliance accuracy with zero hallucinations. **Fallback:** Direct verbatim snippet retrieval of the top-ranked policy chunk. |
| **Teach me** | **AI-Unnecessary for core steps, AI-Necessary for adaptation** | Standard operating procedures (4-step review lifecycle) are fixed and deterministic; hardcoding the step definitions prevents LLM drift. However, dynamically answering operator follow-up edge cases ("*what if altitude is 125m?*") benefits from LLM adaptation. **Fallback:** Static standard 4-step checklist. |
| **Replay Greeting** | **AI-Unnecessary (Best served by templating)** | Generating greetings with an LLM adds unnecessary latency and token cost to a high-frequency interaction. While implemented here with LLM context-awareness, production systems should use deterministic template string interpolation (`"Welcome {name}, {count} items pending"`). **Fallback:** Context-aware template string. |

---

## 🛡️ Fallback Design & 8-Second Timeout (JD Section 3 & 6)

Every LLM call is guarded by an `AbortController` bound to an **8,000ms hard timeout**. If an API key is revoked, network connectivity drops, or the provider stalls:
1. **Never returns raw 500s:** The service catches `LlmTimeoutError` and provider exceptions internally.
2. **Deterministic Graceful Degradation:** A structured fallback object conforming strictly to the Zod schema is returned with `fallback: true`.
3. **Transparent UI Signaling:** The frontend visibly renders an amber `<FallbackNotice />` informing the operator that offline guidance is active, while keeping all controls responsive.

---

## 🔮 What I Would Do Differently With More Time

1. **Hybrid Vector Retrieval (HNSW + BM25):** Replace in-memory keyword scoring with a dual-stage retriever (in-browser or PGVector embeddings + reciprocal rank fusion) for semantic matching across hundreds of operational manuals.
2. **Audio Streaming (WebRTC / Voice-to-Voice):** Upgrade browser text-to-speech to server-streamed neural audio (e.g., ElevenLabs / OpenAI Audio API) with sub-300ms latency.
3. **E2E Playwright Suite:** Add end-to-end browser tests verifying WebSocket/SSE reconnection semantics during simulated network disconnects.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.17.0+ or v20+
- **Package Manager**: `npm` or `pnpm`

### 2. Backend Setup
```bash
cd Backend

# 1. Install dependencies
npm install

# 2. Configure Environment (Default runs out-of-the-box with 'mock' provider!)
# To test with real keys, edit .env: LLM_PROVIDER=openai or anthropic
cp .env.example .env

# 3. Run automated test suite (Unit + Integration with Jest)
npm test

# 4. Start Development Server
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd Frontend

# 1. Install dependencies
npm install

# 2. Start Next.js Development Server
npm run dev
# Web application will open at http://localhost:3000
```

### 4. Running Tests
- **Backend Unit & Integration Tests (Jest + Supertest):**
  ```bash
  cd Backend
  npm run test:unit
  npm run test:integration
  ```
- **Frontend Component Tests (Vitest + Testing Library):**
  ```bash
  cd Frontend
  npm test
  ```

---

## 📋 API Contract (Zod Schemas)

| Endpoint | Method | Input Schema | Output Schema |
|---|---|---|---|
| `/api/approvals` | `GET` | `QueryApprovalsSchema` | `{ stats, count, data: ApprovalItem[] }` |
| `/api/assistant/summary` | `POST` | `{ language?: string }` | `SummaryResponseSchema` (JSON) |
| `/api/assistant/talk` | `POST` | `{ messages: ChatMessage[], stream: true }` | `text/event-stream` (SSE token-by-token) |
| `/api/assistant/help` | `POST` | `{ question: string }` | `HelpResponseSchema` (Answer + Citations) |
| `/api/assistant/teach` | `POST` | `{ currentStep: number, userQuestion?: string }` | `TeachResponseSchema` (Step + Checklist) |
| `/api/assistant/greeting` | `POST` | `{ operatorName?: string }` | `GreetingResponseSchema` |

---

## ⚖️ License & Confidentiality
Confidential technical assignment developed for **Crystal Ball Command Centre / OomniEye**.

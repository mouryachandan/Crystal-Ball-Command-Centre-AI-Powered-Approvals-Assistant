import { Router } from 'express';
import { AssistantController } from '../controllers/assistant.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { aiRateLimiter } from '../middlewares/rateLimiter';
import {
  SummaryRequestSchema,
  TalkRequestSchema,
  HelpRequestSchema,
  TeachRequestSchema,
  GreetingRequestSchema,
} from '../schemas/assistant.schema';

const router = Router();
const controller = new AssistantController();

// Apply AI rate limiter to all assistant endpoints
router.use(aiRateLimiter);

// 1. Present me Summary
router.post('/summary', validateRequest({ body: SummaryRequestSchema }), controller.getSummary);

// 2. Talk to me (SSE token-by-token streaming)
router.post('/talk', validateRequest({ body: TalkRequestSchema }), controller.talkStream);

// 3. Help me (RAG grounded Q&A)
router.post('/help', validateRequest({ body: HelpRequestSchema }), controller.getHelp);

// 4. Teach me (Step-by-step interactive guidance)
router.post('/teach', validateRequest({ body: TeachRequestSchema }), controller.getTeach);

// 5. Replay Greeting (Context-aware dynamic greeting)
router.post('/greeting', validateRequest({ body: GreetingRequestSchema }), controller.getGreeting);

export const assistantRouter = router;


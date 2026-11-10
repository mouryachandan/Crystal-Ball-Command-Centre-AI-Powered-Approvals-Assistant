import { Request, Response, NextFunction } from 'express';
import { AssistantService } from '../services/assistant.service';
import { initSseStream } from '../utils/sse';
import { ChatMessage } from '../types/assistant.types';

export class AssistantController {
  private service: AssistantService;

  constructor(service?: AssistantService) {
    this.service = service || new AssistantService();
  }

  /**
   * Action 1: Present me Summary
   * Produces prioritized structured JSON summary + spoken audio-ready text.
   */
  public getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { language } = req.body as { language?: string };
      const summary = await this.service.generateSummary(language);

      res.status(200).json({
        status: 'success',
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Action 2: Talk to me
   * Multi-turn conversational copilot with Server-Sent Events (SSE) token-by-token streaming.
   */
  public talkStream = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { messages, stream = true } = req.body as {
        messages: ChatMessage[];
        stream?: boolean;
      };

      if (!stream) {
        // Non-streaming fallback option
        const fullResponse = await this.service.generateSummary();
        res.status(200).json({ status: 'success', data: fullResponse });
        return;
      }

      const sse = initSseStream(res);
      sse.init();

      await this.service.streamTalk(messages, sse);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Action 3: Help me
   * Answers operational policy questions grounded strictly on policy RAG chunks.
   */
  public getHelp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { question } = req.body as { question: string };
      const answer = await this.service.answerHelp(question);

      res.status(200).json({
        status: 'success',
        data: answer,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Action 4: Teach me
   * Step-by-step interactive workflow tutorial adapting to operator questions.
   */
  public getTeach = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentStep = 1, userQuestion } = req.body as {
        currentStep?: number;
        userQuestion?: string;
      };

      const step = await this.service.teachOperator(currentStep, userQuestion);

      res.status(200).json({
        status: 'success',
        data: step,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Action 5: Replay Greeting
   * Dynamic, context-aware greeting referencing current queue load and critical items.
   */
  public getGreeting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { operatorName = 'Operator' } = req.body as { operatorName?: string };
      const greeting = await this.service.replayGreeting(operatorName);

      res.status(200).json({
        status: 'success',
        data: greeting,
      });
    } catch (err) {
      next(err);
    }
  };
}


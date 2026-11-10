import { Response } from 'express';

export interface SseClient {
  init: () => void;
  sendToken: (token: string) => void;
  sendEvent: (event: string, data: unknown) => void;
  sendError: (errorMessage: string, isFallback?: boolean) => void;
  close: () => void;
}

export function initSseStream(res: Response): SseClient {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering (Nginx, etc.)
  res.flushHeaders?.();

  return {
    init: () => {
      res.write(': connected\n\n');
    },
    sendToken: (token: string) => {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    },
    sendEvent: (event: string, data: unknown) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    },
    sendError: (errorMessage: string, isFallback = false) => {
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: errorMessage, fallback: isFallback })}\n\n`
      );
    },
    close: () => {
      res.write('event: done\ndata: [DONE]\n\n');
      res.end();
    },
  };
}


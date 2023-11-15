/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';

let openai: OpenAI;
let thread: OpenAI.Beta.Threads.Thread;
export function getOpenAI(openAiKey?: string): OpenAI {
  if (openai) return openai;
  if (!openAiKey) {
    throw new CustomError(
      'application_error',
      'Missing environment variable NX_OPENAI_KEY',
      {
        missing_key: true,
      }
    );
  }
  openai = new OpenAI({ apiKey: openAiKey });
  return openai;
}

export async function getThread(
  openai: OpenAI
): Promise<OpenAI.Beta.Threads.Thread> {
  if (thread) return thread;
  thread = await openai.beta.threads.create();
  return thread;
}

export class CustomError extends Error {
  public type: string;
  public data: Record<string, any>;

  constructor(
    type: string = 'application_error',
    message: string,
    data: Record<string, any> = {}
  ) {
    super(message);
    this.type = type;
    this.data = data;
  }
}
export interface ErrorResponse {
  message: string;
  data?: any;
}

export function extractErrorMessage(err: unknown): ErrorResponse {
  if (err instanceof CustomError) {
    return { message: err.message, data: err.data };
  }

  if (typeof err === 'object' && err !== null) {
    const errorObj = err as { [key: string]: any };
    const message =
      errorObj['message'] || errorObj['error']?.message || 'Unknown error';
    return { message, data: errorObj['data'] || null };
  }

  return { message: 'Unknown error' };
}

export async function waitForRunCompletion(
  runId: string,
  threadId: string,
  interval: number = 1000,
  timeout: number = 60000
): Promise<{
  runResult: OpenAI.Beta.Threads.Runs.Run;
  messages: OpenAI.Beta.Threads.Messages.ThreadMessagesPage;
}> {
  let timeElapsed = 0;

  return new Promise(async (resolve, reject) => {
    while (timeElapsed < timeout) {
      const run = await openai.beta.threads.runs.retrieve(threadId, runId);
      if (run.status === 'completed') {
        const result = await openai.beta.threads.runs.retrieve(threadId, runId);
        const messagesFromThread: OpenAI.Beta.Threads.Messages.ThreadMessagesPage =
          await openai.beta.threads.messages.list(threadId);
        resolve({ runResult: result, messages: messagesFromThread });
        return;
      } else if (
        run.status === 'failed' ||
        run.status === 'cancelled' ||
        run.status === 'expired'
      ) {
        reject(new Error(`Run ended with status: ${run.status}`));
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      timeElapsed += interval;
    }

    reject(
      new Error('Timeout: Run did not complete within the specified time.')
    );
  });
}

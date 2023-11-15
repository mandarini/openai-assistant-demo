/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai';

let openai: OpenAI;

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

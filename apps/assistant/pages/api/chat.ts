/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from 'next/server';
import {
  extractErrorMessage,
  getOpenAI,
  getThread,
  waitForRunCompletion,
} from '@nx-ai-assistant/utils';

const openAiKey = process.env['NX_OPENAI_KEY'];
const assistantId = process.env['NX_ASSISTANT_ID'];

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  try {
    const openai = getOpenAI(openAiKey);

    const { userQuery } = (await request.json()) as { userQuery: string };
    const thread = await getThread(openai);

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userQuery,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId as string,
    });

    const result = await waitForRunCompletion(run.id, thread.id);

    return new Response(JSON.stringify(result.messages.data), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (err: unknown) {
    console.error('Error: ', err);
    const errorResponse = extractErrorMessage(err);
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}

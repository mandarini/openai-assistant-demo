import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Stream } from 'openai/streaming';
import { extractErrorMessage, getOpenAI } from '@nx-ai-assistant/utils';

const openAiKey = process.env['NX_OPENAI_KEY'];

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  try {
    const openai = getOpenAI(openAiKey);

    const { messages } = (await request.json()) as { messages: [] };

    const response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> =
      await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: messages,
        temperature: 0,
        stream: true,
      });

    // const sourcesMarkdown = formatMarkdownSources(pageSections);
    // const stream = OpenAIStream(response);
    // const finalStream = await appendToStream(stream, sourcesMarkdown);

    return new StreamingTextResponse(OpenAIStream(response));
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

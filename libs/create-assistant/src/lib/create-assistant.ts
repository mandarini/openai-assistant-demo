/* eslint-disable @typescript-eslint/no-unused-vars */
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { getOpenAI } from '@nx-ai-assistant/utils';

const openAiKey = process.env['NX_OPENAI_KEY'];

export async function createAssistant(): Promise<OpenAI.Beta.Assistants.Assistant> {
  const openai = getOpenAI(openAiKey);

  const files: OpenAI.Files.FileObject[] = [];
  const directoryPath = path.join(__dirname, '../../../../../docs');
  try {
    console.log('Reading directory');
    const allFileNames = fs.readdirSync(directoryPath);
    let count = 0;
    for (const file of allFileNames) {
      count++;
      const filePath = path.join(directoryPath, file);
      console.log('#', count, 'of', allFileNames.length);
      console.log(':', file, ':', filePath);
      try {
        const oneFile = await openai.files.create({
          purpose: 'assistants',
          file: fs.createReadStream(filePath),
        });
        files.push(oneFile);
      } catch (err) {
        console.error('Error adding file:', err);
      }
      console.log(allFileNames.length - count, 'files left');
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }

  const assistant: OpenAI.Beta.Assistants.Assistant =
    await openai.beta.assistants.create({
      instructions:
        'You are Nx Assistant, a helpful assistant for Nx Dev Tools. Your primary role is to provide accurate and sourced information about Nx Dev Tools. Rely solely on the information in the files you have; do not use external knowledge. If the information is not in the files, respond with "Sorry I cannot help with that".',
      model: 'gpt-4-1106-preview',
      tools: [{ type: 'retrieval' }],
      file_ids: [...files.map((file) => file.id)],
    });
  console.log('Assistant created, with id:', assistant.id);
  return assistant;
}

createAssistant();

# OpenAI Assistant API

## Introduction

This project demonstrates the integration of OpenAI's Assistant API into a React/Next.js application. The application showcases a chat interface where users can interact with the AI assistant. This demo serves as an example of how OpenAI's powerful AI models can be leveraged within a web application to create interactive and engaging user experiences.

## Features

### Interactive Chat Interface

Users can send queries and receive responses from the AI assistant in real-time.

### Edge Function Integration

Utilizes Next.js API routes (Edge Functions) for server-side processing and interaction with OpenAI's Assistant API.

### Dynamic Message Display

Messages are dynamically displayed in a chat-like interface, with different alignments and styles for user and assistant messages.

### Real-Time Feedback

Includes a loading spinner to indicate when the AI is processing a request.

## Technologies Used

- Nx: For management of the monorepo.
- React/Next.js: For the front-end interface and server-side logic.
- OpenAI API: Specifically the Assistant API for generating responses based on user queries.

## Setup and Installation

### 01. Clone the Repository

```bash
 git clone git@github.com:mandarini/openai-assistant-demo.git
```

### 02. Install Dependencies

```bash
pnpm install
```

### 03. Environment Variables

1. Create a `.env` file in the `apps/assistant` directory.
2. Add NX_OPENAI_KEY with your OpenAI API key.
3. Add NX_ASSISTANT_ID with the ID of your OpenAI Assistant.

## Run the Assistant Demo Application

```bash
npx nx serve assistant
```

## Usage

1. Open the application in your browser.
2. Type your Nx-related query in the input box and press 'Send' or hit Enter.
3. View the AI assistant's response in the chat interface.

## Project Structure

- [`apps/assistant/app`](apps/assistant/app): Contains the React/Next.js pages including the main chat interface.
- [`apps/assistant/pages/api/chat`](apps/assistant/pages/api/chat.ts): Includes the Edge Function for handling API requests and interactions with the OpenAI Assistant. Some of the reasons why we're using an edge function to handle the OpenAI calls is for security reasons (keep API key hidden) and to avoid CORS issues.
- [`libs/utils`](libs/utils): Utility functions for API interactions and error handling.

## Limitations and Future Work

- Text Streaming is not yet supported by the API so the responses are super slow
- We should show sources for the AI responses
- Improvement in error handling and user feedback mechanisms should be considered

## Contributing

Contributions to enhance this demo are welcome. Please follow the standard fork, branch, and pull request workflow.

## License

MIT

# OpenAI Assistants API

## Introduction

This project demonstrates the integration of OpenAI's Assistants API into a React/Next.js application. The application showcases a chat interface where users can interact with the AI assistant. This demo serves as an example of how OpenAI's powerful AI models can be leveraged within a web application to create interactive and engaging user experiences.

## Features

### Interactive Chat Interface

Users can send queries and receive responses from the AI assistant in real-time.

### Edge Function Integration

Utilizes Next.js API routes (Edge Functions) for server-side processing and interaction with OpenAI's Assistants API.

### Dynamic Message Display

Messages are dynamically displayed in a chat-like interface, with different alignments and styles for user and assistant messages.

## Technologies Used

- Nx: For management of the monorepo.
- React/Next.js: For the front-end interface and server-side logic.
- OpenAI API: Specifically the [Assistants API](https://platform.openai.com/docs/assistants/overview) for generating responses based on user queries.

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

## Custom Assistant Creation with Documentation Integration

### Overview

The [`createAssistant` function](libs/create-assistant/src/lib/create-assistant.ts) demonstrates a powerful feature of the OpenAI API, allowing the creation of a custom AI assistant tailored to specific needs. This function is particularly useful for integrating a set of documentation files into the assistant's knowledge base, enabling it to provide accurate and source-cited responses based on the provided documentation. You can read more about how the Assistants API with Knowledge Retrieval works in the [OpenAI Docs](https://platform.openai.com/docs/assistants/tools/knowledge-retrieval).

### Functionality

#### Initialization

The function initializes by setting up the OpenAI client and creating a new assistant.

#### Document Processing

It reads a directory containing documentation files (in this case, related to Nx Dev Tools). Each file in the directory is uploaded to OpenAI's servers.

#### Assistant Creation

After uploading the documents, it creates a new assistant with a specific set of instructions. This assistant is configured to use the uploaded files as its primary knowledge base, ensuring that all responses are based on the provided documentation.

#### How to use

This function can be executed to create an assistant that is particularly suited for applications where responses need to be based on a controlled set of documents, like internal tools documentation, FAQs, or policy manuals. By uploading relevant documents, the assistant becomes a specialized resource, providing responses that are consistent with the organization's information and guidelines.

You can call this function with the following command:

```bash
npx nx run create-assistant:run-node
```

and this will upload the files in the `docs` directory and create a new assistant with the all the files id's. You can then use the assistant ID to interact with the assistant in your application.

### Where are my files?

You can find all your uploaded files here: [https://platform.openai.com/files](https://platform.openai.com/files)

There, you can also upload new files and delete existing ones, using the GUI. You can read more about how to use the `File` API here: [https://platform.openai.com/docs/api-reference/files](https://platform.openai.com/docs/api-reference/files).

## The Assistant Demo Application

### Run the application

```bash
npx nx serve assistant
```

### Usage

1. Open the application in your browser.
2. Type your Nx-related query in the input box and press 'Send' or hit Enter.
3. View the AI assistant's response in the chat interface.

### Project Structure

- [`apps/assistant/app`](apps/assistant/app): Contains the React/Next.js pages including the main chat interface.
- [`apps/assistant/pages/api/chat`](apps/assistant/pages/api/chat.ts): Includes the Edge Function for handling API requests and interactions with the OpenAI Assistant. Some of the reasons why we're using an edge function to handle the OpenAI calls is for security reasons (keep API key hidden) and to avoid CORS issues.
- [`libs/utils`](libs/utils): Utility functions for API interactions and error handling.

## Limitations and Future Work

- Text Streaming is not yet supported by the API so the responses are super slow
- We should show sources for the AI responses
- Improvement in error handling and user feedback mechanisms should be considered

### Run Completion Polling Mechanism

### Purpose

The `waitForRunCompletion` function is crucial for handling the asynchronous nature of interactions with the OpenAI API, specifically when waiting for the `run` task to complete. The `waitForRunCompletion` function is designed to periodically check the status of a `run` and retrieve results once the `run` status is `completed`.

### How It Works

#### Polling

The function implements a polling mechanism where it periodically checks the status of a run by retrieving the Run object from the OpenAI API.

#### Run Status Check

For each polling iteration, the function checks if the run has completed, failed, been cancelled, or expired.

#### Retrieving Results

Once the run is completed, the function fetches the results, which include both the final status of the run and the messages associated with the thread.

#### Error Handling

In case of failure, cancellation, expiration, or timeout, the function handles these scenarios by rejecting the promise with an appropriate error message.

### Importance in the Current API Design

As per the [current OpenAI API documentation](https://platform.openai.com/docs/assistants/how-it-works), there's no streaming support for run updates. Therefore, applications need to implement a polling mechanism to stay updated with the run status. waitForRunCompletion functionally addresses this need by providing a reliable method to wait for a run's completion and handle various statuses of the run.

### Future Considerations

OpenAI plans to introduce support for streaming in the future, which will simplify the process of tracking run status. However, until such features are implemented, this polling mechanism remains an essential part of interacting with the OpenAI API for asynchronous tasks.

## Contributing

Contributions to enhance this demo are welcome. Please follow the standard fork, branch, and pull request workflow.

## License

MIT

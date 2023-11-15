import { FormEvent, useState } from 'react';
import './index.css';
import { Message, useChat } from 'ai/react';

/* eslint-disable-next-line */
export interface AskProps {}

export function Ask(props: AskProps) {
  const [error, setError] = useState<Error | null>(null);
  // const [startedReply, setStartedReply] = useState(false);
  // const [isStopped, setStopped] = useState(false);
  const {
    messages,

    handleSubmit: _handleSubmit,
  } = useChat({
    api: '/api/query-ai-handler',
    onError: (error) => {
      setError(error);
    },
    onResponse: (_response) => {
      // setStartedReply(true);
      setError(null);
    },
    onFinish: (response: Message) => {
      // setStartedReply(false);
    },
  });
  const [inputValue, setInputValue] = useState(''); // Stores the current input field value

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // setStopped(false);
    _handleSubmit(event);
  };

  return (
    <>
      <div className="chat-container">
        <div className="message-display-area">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <b>{message.role}:</b> {message.content}
            </div>
          ))}
        </div>
        <form className="message-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
      {error && (
        <div>
          <p>There was an error: </p>
          <p>{error.message}</p>
        </div>
      )}
    </>
  );
}

export default Ask;

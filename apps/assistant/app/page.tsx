/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import './page.scss';
import {
  MessageContentText,
  ThreadMessage,
} from 'openai/resources/beta/threads/messages/messages';

export default function Index() {
  const [data, setData] = useState({ messages: [] as ThreadMessage[] }); // Assuming the data structure has a 'messages' field
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(''); // Stores the current input field value

  useEffect(() => {
    const messageArea = document.querySelector('.message-display-area');
    if (messageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }, [data.messages]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    try {
      setIsLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery: inputValue }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        console.error(
          'There was an error fetching the response.',
          response,
          errorMessage?.message
        );
        throw (
          errorMessage?.message ?? 'There was an error fetching the response.'
        );
      }
      const result: ThreadMessage[] = await response.json();
      setData({ messages: result });
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <div className="message-display-area">
        {isLoading && <div className="loader"></div>}{' '}
        {data.messages.map((message, index) => (
          <div key={index} className="message">
            <div className={`${message.role}`}>
              <p>
                <b>{message.role}:</b>
              </p>
              <p>{(message.content as MessageContentText[])?.[0].text.value}</p>
            </div>
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
      {error && (
        <div>
          <p>There was an error: </p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

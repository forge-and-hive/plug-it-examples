import React, { useState } from 'react';
import { actions } from 'astro:actions';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

// Add custom styles for markdown
const markdownStyles = {
  // Target all headers
  h1: 'text-xl font-bold my-2',
  h2: 'text-lg font-bold my-2',
  h3: 'text-md font-bold my-2',
  h4: 'font-bold my-1',
  // Lists
  ul: 'list-disc pl-5 my-2',
  ol: 'list-decimal pl-5 my-2',
  li: 'ml-2',
  // Other elements
  p: 'my-1',
  a: 'text-blue-600 underline',
  code: 'bg-gray-100 text-red-500 px-1 rounded-sm font-mono text-sm',
  pre: 'bg-gray-100 p-2 rounded my-2 overflow-x-auto font-mono text-sm',
  blockquote: 'border-l-4 border-gray-300 pl-2 italic my-2',
  table: 'border-collapse my-2',
  th: 'border border-gray-300 px-2 py-1 bg-gray-100',
  td: 'border border-gray-300 px-2 py-1',
};

// Define markdown components with proper typing
const markdownComponents: Components = {
  h1: ({children}) => <h1 className={markdownStyles.h1}>{children}</h1>,
  h2: ({children}) => <h2 className={markdownStyles.h2}>{children}</h2>,
  h3: ({children}) => <h3 className={markdownStyles.h3}>{children}</h3>,
  h4: ({children}) => <h4 className={markdownStyles.h4}>{children}</h4>,
  ul: ({children}) => <ul className={markdownStyles.ul}>{children}</ul>,
  ol: ({children}) => <ol className={markdownStyles.ol}>{children}</ol>,
  li: ({children}) => <li className={markdownStyles.li}>{children}</li>,
  p: ({children}) => <p className={markdownStyles.p}>{children}</p>,
  a: ({href, children}) => <a href={href} className={markdownStyles.a} target="_blank" rel="noopener noreferrer">{children}</a>,
  pre: ({children}) => <pre className={markdownStyles.pre}>{children}</pre>,
  blockquote: ({children}) => <blockquote className={markdownStyles.blockquote}>{children}</blockquote>,
  table: ({children}) => <table className={markdownStyles.table}>{children}</table>,
  th: ({children}) => <th className={markdownStyles.th}>{children}</th>,
  td: ({children}) => <td className={markdownStyles.td}>{children}</td>
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  status: string;
  output: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setMessages((prev: Message[]) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const result = await actions.chat({ message: userMessage });
      if (result.error) {
        throw new Error(result.error.message);
      }
      const response = result.data as ChatResponse;
      setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: response.output }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev: Message[]) => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-[500px] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chat Assistant</h2>
        {messages.map((message: Message, index: number) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.role === 'user' ? (
                message.content
              ) : (
                <div className="markdown-content max-w-full text-left">
                  <ReactMarkdown components={markdownComponents}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
} 
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Copy, ArrowLeft } from 'lucide-react';
import { useText } from '../context/TextContext';
import LoadingOverlay from '../components/LoadingOverlay';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBX_3Kxboj18gHB2RPoATlQ0mpmlQMjiTg');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const { extractedText } = useText();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\n\n/g, '</p><p>') // Paragraph breaks
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/^\s*[-*]\s(.*)$/gm, '<ul><li class="large-dot">$1</li></ul>') // Unordered lists with large dots
      .replace(/^\s*\d+\.\s(.*)$/gm, '<ol><li>$1</li></ol>') // Ordered lists
      .trim();
  };
  
  // If no text is extracted, show a placeholder message
  if (!extractedText) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100">
        <p className="text-xl text-gray-600">No image processed</p>
      </div>
    );
  }

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Context: ${extractedText}\n\nQuestion: ${input}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.text() }
      ]);
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-100">
      <div className="bg-white shadow-md p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go back">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 rounded-full p-2 ${message.role === 'user' ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                {message.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-gray-600" />}
              </div>
              <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className="inline-block max-w-[80%] group">
                  <div className={`rounded-lg p-3 ${message.role === 'user' ? 'bg-indigo-100 text-indigo-900' : 'bg-white text-gray-800'} shadow-md`} dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />
                  <button onClick={() => copyToClipboard(message.content)} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity" title="Copy message">
                    <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the text..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 text-white rounded-lg px-6 py-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
     
    </div>
  );
}

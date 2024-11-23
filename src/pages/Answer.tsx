import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Copy } from 'lucide-react';
import { useText } from '../context/TextContext';
import LoadingOverlay from '../components/LoadingOverlay';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI('AIzaSyBX_3Kxboj18gHB2RPoATlQ0mpmlQMjiTg');

export default function Answer() {
  const { extractedText, answer, setAnswer } = useText();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const copyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('Text copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy text: ', error);
        });
    }
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

  // If no extracted text, show a message and redirect
  if (!extractedText) {
    navigate('/');
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <p className="text-xl text-gray-600">No image processed</p>
      </div>
    );
  }

  // Fetch AI-generated analysis when text is available
  useEffect(() => {
    const generateAnswer = async () => {
      if (extractedText && !answer) {
        setIsLoading(true);
        try {
          const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
          const result = await model.generateContent(`Analyze this text and provide insights. Use markdown formatting for structure, including lists and paragraphs: ${extractedText}`);
          const response = await result.response;
          setAnswer(response.text());
        } catch (error) {
          console.error('Error generating answer:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateAnswer();
  }, [extractedText, answer, setAnswer]);

  return (
    <div className="w-full p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 gap-1">
        {/* Header with AI analysis icon and title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">AI Analysis</h2>
          </div>
          <button
            onClick={() => answer && copyToClipboard(answer)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-5 h-5 text-indigo-600" />
          </button>
        </div>

        {/* Display loading or result */}
        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: formatText(answer) }} />
        )}
      </div>
    </div>
  );
}

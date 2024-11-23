import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Copy, RefreshCcw } from 'lucide-react'; // Import RefreshCcw icon
import { useText } from '../context/TextContext';
import LoadingOverlay from '../components/LoadingOverlay';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBX_3Kxboj18gHB2RPoATlQ0mpmlQMjiTg');

export default function Summary() {
  const { extractedText, summary, setSummary } = useText();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Copy text to clipboard with feedback
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, []);

  // Format the summary to handle lists and structure
  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\n\n/g, '</p><p>') // Paragraph breaks
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/^\s*[-*]\s(.*)$/gm, '<ul><li>$1</li></ul>') // Unordered lists
      .replace(/^\s*\d+\.\s(.*)$/gm, '<ol><li>$1</li></ol>') // Ordered lists
      .trim();
  };

  // Generate summary only when extractedText changes and summary is empty
  useEffect(() => {
    const generateSummary = async () => {
      if (extractedText && !summary) {
        setIsLoading(true);
        try {
          const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
          const result = await model.generateContent(
            `Summarize this text, make it structured and handle lists: ${extractedText}`
          );
          const response = await result.response;
          setSummary(response.text());
        } catch (error) {
          console.error('Error generating summary:', error);
          setSummary('Unable to generate summary. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Call the summary generation if extractedText changes and summary is empty
    if (extractedText && !summary) {
      generateSummary();
    }
  }, [extractedText, summary, setSummary]);

  // Navigate to home if no extracted text exists
  useEffect(() => {
    if (!extractedText) {
      navigate('/');
    }
  }, [extractedText, navigate]);

  // Generate new summary on button click
  const handleGenerateNewSummary = async () => {
    if (extractedText) {
      setIsLoading(true);
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(
          `Summarize this text, make it structured and handle lists: ${extractedText}`
        );
        const response = await result.response;
        setSummary(response.text());
      } catch (error) {
        console.error('Error generating summary:', error);
        setSummary('Unable to generate summary. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // If no extracted text, show fallback message
  if (!extractedText) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <p className="text-xl text-gray-600">No image processed</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Extracted Text */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Extracted Text</h2>
            </div>
            <button
              onClick={() => copyToClipboard(extractedText)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy text"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{extractedText}</p>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Button to generate a new summary at the top */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Summary</h2>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleGenerateNewSummary}
                className="flex items-center  text-gray-600  rounded-full mr-2"
              >
                <RefreshCcw className="w-5 h-5 mr-2" /> {/* Refresh Icon */}
                
              </button>
              <button
                onClick={() => summary && copyToClipboard(summary)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Copy summary"
              >
                <Copy className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          {isLoading ? (
            <LoadingOverlay />
          ) : summary ? (
            <div
              dangerouslySetInnerHTML={{ __html: formatText(summary) }} // Render formatted summary
            />
          ) : (
            <p className="text-gray-500 italic">Generating summary...</p>
          )}
        </div>
      </div>
    </div>
  );
}

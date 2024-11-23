import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';
import ImageCropper from '../components/ImageCropper';
import LoadingOverlay from '../components/LoadingOverlay';
import { useText } from '../context/TextContext';
import { createWorker } from 'tesseract.js';

function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setExtractedText, setAnswer } = useText();  // Make sure you reset both extractedText and answer
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset previous text and answer
      setExtractedText('');
      setAnswer('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = useCallback((croppedImage: string) => {
    setCroppedImage(croppedImage);
  }, []);

  const processImage = async () => {
    if (!croppedImage) return;

    setIsProcessing(true);
    try {
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(croppedImage);
      const cleanText = text.replace(/[^\w\s.,!?-]/g, '').trim();
      setExtractedText(cleanText);
      await worker.terminate();
      navigate('/summary');
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Section with rounded corners and modern style */}
      <header className="bg-indigo-600 text-white py-4 mb-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center max-w-4xl mx-auto px-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Extractify AI</h1>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-4 mb-4 rounded-lg shadow-sm">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Tool</h2>
          <p className="text-gray-600 text-0.2xl ">
            This tool uses AI-powered Optical Character Recognition (OCR) to extract text from images. Simply upload an image, crop it, and let the AI analyze and summarize the text content.
          </p>
        </div>
      </section>

      {/* Main Content */}
      {isProcessing && <LoadingOverlay />}

      {!selectedImage ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-8 text-center"
        >
          <div className="mb-8">
            <ImageIcon className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload an Image</h2>
            <p className="text-gray-600">Select an image to extract text using AI</p>
          </div>

          <label className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
            <Upload className="w-5 h-5 mr-2" />
            <span>Choose Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </motion.div>
      ) : (
        <>
          <ImageCropper imageUrl={selectedImage} onCrop={handleCrop} />
          {croppedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <button
                onClick={processImage}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Extract Text
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;

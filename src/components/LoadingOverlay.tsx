// LoadingOverlay.tsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingOverlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      <div className="text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <motion.div
            animate={{
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ['20%', '20%', '50%', '50%', '20%'],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute inset-0 border-4 border-white opacity-30"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1.5, 1, 1],
              rotate: [0, 0, 180, 180, 0],
              borderRadius: ['20%', '20%', '50%', '50%', '20%'],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute inset-0 border-4 border-white"
          />
        </div>
        <p className="text-white text-xl font-medium py-15">Processing with AI...</p>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay; // Make sure it's a default export now.

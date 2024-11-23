import React, { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { motion } from 'framer-motion';
import { Maximize2, Crop, ScanLine } from 'lucide-react';

interface ImageCropperProps {
  imageUrl: string;
  onCrop: (croppedImage: string) => void;
}

function ImageCropper({ imageUrl, onCrop }: ImageCropperProps) {
  const [cropper, setCropper] = useState<any>();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getCropData = () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      onCrop(croppedCanvas.toDataURL());
    }
  };

  const handleFullPage = () => {
    if (cropper) {
      cropper.setData({ x: 0, y: 0, width: cropper.getContainerData().width, height: cropper.getContainerData().height });
      onCrop(cropper.getCroppedCanvas().toDataURL());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-xl p-4 ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Crop Image</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Maximize2 className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleFullPage}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ScanLine className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={getCropData}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Crop className="w-4 h-4" />
            <span>Crop</span>
          </button>
        </div>
      </div>
      <Cropper
        src={imageUrl}
        style={{ height: isFullScreen ? '90vh' : '400px', width: '100%' }}
        onInitialized={(instance) => setCropper(instance)}
        zoomable={true}
        scalable={true}
        rotatable={true}
      />
    </motion.div>
  );
}

export default ImageCropper;
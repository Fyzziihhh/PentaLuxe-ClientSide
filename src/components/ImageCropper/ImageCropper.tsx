import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import getCroppedImg from "./getCroppedImage"; // Import the helper function for cropping

interface ImageCropperProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3); // Default aspect ratio

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setAspectRatio(img.width / img.height); // Set aspect ratio based on the image dimensions
    };
  }, [imageSrc]);

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio} // Dynamic aspect ratio based on the image
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>

      {/* Adjusted Buttons */}
      <div className="absolute bottom-5 flex space-x-4">
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCrop}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          Crop Image
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;

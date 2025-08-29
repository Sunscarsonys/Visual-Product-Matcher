import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return false;
    }

    if (file.size > maxSize) {
      setError('Image size must be less than 10MB');
      return false;
    }

    return true;
  };

  const handleFileUpload = useCallback((files: FileList) => {
    const file = files[0];
    if (!file || !validateImage(file)) return;

    setError(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      setError('Please enter a valid image URL');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      new URL(imageUrl);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        setPreviewImage(imageUrl);
        setIsLoading(false);
      };

      img.onerror = () => {
        setError('Unable to load image from this URL. Please check the URL and try again.');
        setIsLoading(false);
      };

      img.src = imageUrl;
    } catch {
      setError('Please enter a valid URL');
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (previewImage) {
      onImageUpload(previewImage);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    setImageUrl('');
    setError(null);
  };

  return (
    <div className="space-y-8 poppins-text">
      <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upload Your Image</h2>

        {!previewImage ? (
          <div className="space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ease-in-out 
    ${dragActive
                  ? 'border-blue-400 bg-white/30 backdrop-blur-sm shadow-md'
                  : 'border-white/50 hover:border-white/30 hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-md'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />

              <div className="space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${dragActive ? 'bg-blue-200' : 'bg-gray-100'
                  }`}>
                  <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>

                <div>
                  <p className="text-lg font-medium text-gray-200">
                    {dragActive ? 'Drop your image here' : 'Drag and drop your image here'}
                  </p>
                  <p className="text-black mt-2">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Choose File
                  </button>
                </div>

                <p className="text-sm text-gray-300">
                  Supports JPEG, PNG, WebP, GIF up to 10MB
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="h-px bg-gray-800 flex-1"></div>
              <span className="text-white text-sm">OR</span>
              <div className="h-px bg-gray-800 flex-1"></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Link className="w-5 h-5 text-white" />
                <span className="font-medium text-black">Enter Image URL</span>
              </div>
              <div className="flex space-x-0">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-full rounded-r-none focus:outline-none focus:ring-0 focus:border-gray-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-r-full rounded-l-none font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? 'Loading...' : 'Load'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-80 rounded-lg shadow-lg border border-gray-200"
              />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-medium rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <ImageIcon className="w-5 h-5 inline mr-2" />
              Find Similar Products
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

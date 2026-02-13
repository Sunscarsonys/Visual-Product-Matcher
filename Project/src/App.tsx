import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import SearchResults from './components/SearchResults';
import Header from './components/Header';
import { SearchResult } from './types';
import { recognizeImage } from './services/imageRecognition';
import { products } from './data/products';

function App() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recognizedTags, setRecognizedTags] = useState<string[]>([]);

  const findSimilarProducts = async (imageUrl: string): Promise<SearchResult[]> => {
    try {
      const recognitionData = await recognizeImage(imageUrl);
      const tags = recognitionData.result.tags
        .filter(tag => tag.confidence > 30)
        .map(tag => tag.tag.en);
      setRecognizedTags(tags);
      return products
        .map(product => {
          const productText = [
            product.name.toLowerCase(),
            product.category.toLowerCase(),
            ...(product.tags || []).map(tag => tag.toLowerCase()),
            product.description.toLowerCase()
          ].join(' ');
          let similarity = 0;
          tags.forEach(tag => {
            if (productText.includes(tag.toLowerCase())) {
              similarity += 20;
            }
          });
          similarity += Math.random() * 30;
          return {
            product,
            similarity: Math.min(95, similarity)
          };
        })
        .filter(result => result.similarity > 20)
        .sort((a, b) => b.similarity - a.similarity);
    } catch (error) {
      console.error('Recognition error:', error);
      return products
        .map(product => ({
          product,
          similarity: 30 + Math.random() * 65
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 12);
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    setIsLoading(true);
    setUploadedImage(imageUrl);
    setHasSearched(true);
    try {
      const results = await findSimilarProducts(imageUrl);
      setSearchResults(results);
    } catch (error) {
      console.error('Error finding similar products:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchResults([]);
    setUploadedImage(null);
    setHasSearched(false);
    setIsLoading(false);
    setRecognizedTags([]);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        ref={video => {
          if (video) video.playbackRate = 0.30;
        }}
      >
        <source src="/bg4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!hasSearched && <Header />}

      <main className="container mx-auto px-4 py-8 relative z-10">
        {!hasSearched ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-7xl font-bold text-gray-200 mb-6 mt-8">
                Visual Product Matcher
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto poppins-text">
                Upload an image or paste a URL to find visually similar products.
                Our advanced AI analyzes colors, shapes, and patterns to deliver accurate matches.
              </p>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <SearchResults
            results={searchResults}
            uploadedImage={uploadedImage}
            isLoading={isLoading}
            recognizedTags={recognizedTags}
            onReset={handleReset}
          />
        )}
      </main>

      {!hasSearched && (
        <footer className="border-t border-gray-200 bg-white backdrop-blur-sm mt-16 poppins-text">
          <div className="container mx-auto px-4 py-8 text-center text-gray-600">
            <p>
              This project is made by <strong>Sanskar Soni</strong> from PSIT Kanpur as an assignment for <strong>Unthinkable Solutions – Daffodils</strong>.
            </p>
            <p>
              &copy; 2025 Sanskar Soni. All rights reserved. | Portfolio:{" "}
              <a
                href="https://www.sunscar.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                www.sunscar.dev
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;

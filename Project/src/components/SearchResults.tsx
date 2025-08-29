import React, { useState, useMemo } from 'react';
import { ArrowLeft, Filter, SortDesc, Star, ExternalLink, Loader } from 'lucide-react';
import { SearchResult } from '../types';

interface SearchResultsProps {
  results: SearchResult[];
  uploadedImage: string | null;
  isLoading: boolean;
  recognizedTags: string[];
  onReset: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  uploadedImage,
  isLoading,
  recognizedTags,
  onReset
}) => {
  const [minSimilarity, setMinSimilarity] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'similarity' | 'price'>('similarity');

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(results.map(r => r.product.category))];
    return cats;
  }, [results]);

  const filteredResults = useMemo(() => {
    let filtered = results.filter(r => r.similarity >= minSimilarity);

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.product.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'similarity') {
        return b.similarity - a.similarity;
      } else {
        return (a.product.price || 0) - (b.product.price || 0);
      }
    });

    return filtered;
  }, [results, minSimilarity, selectedCategory, sortBy]);

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'text-green-600 bg-green-100';
    if (similarity >= 80) return 'text-blue-600 bg-blue-100';
    if (similarity >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getSimilarityStars = (similarity: number) => {
    const stars = Math.round(similarity / 20);
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto h-full min-h-screen flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Image</h2>
              <p className="text-gray-600">
                Our AI is processing visual features and finding similar products...
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
                style={{ width: '70%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 poppins-text">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 text-black hover:text-gray-900 hover:bg-white/70 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>New Search</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          Found {filteredResults.length} Similar Products
        </h1>

        <div className="w-20"></div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {uploadedImage && (
            <div className="bg-white backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Your Image</h3>
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full rounded-lg shadow-md border border-gray-200"
              />
              {recognizedTags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recognized:</h4>
                  <div className="flex flex-wrap gap-2">
                    {recognizedTags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-white backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">Filters</h3>
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-sm font-medium text-gray-700">
                Min Similarity: {minSimilarity}%
              </label>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minSimilarity}
                onChange={(e) => setMinSimilarity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
              />
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SortDesc className="w-4 h-4 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">Sort By</label>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'similarity' | 'price')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="similarity">Similarity Score</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {filteredResults.length === 0 ? (
            <div className="bg-white backdrop-blur-sm rounded-xl p-12 shadow-lg border border-gray-200 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or upload a different image.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredResults.map((result, index) => (
                <div
                  key={`${result.product.id}-${index}`}
                  className="bg-white backdrop-blur-sm rounded-xl shadow-lg border border-gray-500 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={result.product.image}
                      alt={result.product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${getSimilarityColor(result.similarity)}`}>
                      {Math.round(result.similarity)}%
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{result.product.name}</h3>
                      <p className="text-sm text-gray-600">{result.product.category}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                      {getSimilarityStars(result.similarity)}
                      <span className="text-sm text-gray-600 ml-2">
                        {Math.round(result.similarity)}% match
                      </span>
                    </div>

                    {result.product.price && (
                      <div className="text-lg text-green-600">
                        ₹{result.product.price.toFixed(2)}
                      </div>
                    )}

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {result.product.description}
                    </p>

                    {result.product.sourceUrl && (
                      <a
                        href={result.product.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                      >
                        <span>View Product</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

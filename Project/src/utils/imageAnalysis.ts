import { products } from '../data/products';
import { SearchResult, ImageAnalysis } from '../types';

const extractDominantColors = async (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve([]);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const colorMap = new Map<string, number>();

        for (let i = 0; i < data.length; i += 40) {
          const r = Math.floor(data[i] / 51) * 51;
          const g = Math.floor(data[i + 1] / 51) * 51;
          const b = Math.floor(data[i + 2] / 51) * 51;
          
          const color = `${r},${g},${b}`;
          colorMap.set(color, (colorMap.get(color) || 0) + 1);
        }

        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([color]) => `rgb(${color})`);

        resolve(sortedColors);
      } catch (error) {
        console.error('Error extracting colors:', error);
        resolve([]);
      }
    };

    img.onerror = () => resolve([]);
    img.src = imageUrl;
  });
};

const calculateBrightness = async (imageUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(128);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let totalBrightness = 0;
        let pixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
          totalBrightness += brightness;
          pixelCount++;
        }

        resolve(totalBrightness / pixelCount);
      } catch (error) {
        console.error('Error calculating brightness:', error);
        resolve(128);
      }
    };

    img.onerror = () => resolve(128);
    img.src = imageUrl;
  });
};

const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number; aspectRatio: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };

    img.onerror = () => resolve({ width: 1, height: 1, aspectRatio: 1 });
    img.src = imageUrl;
  });
};

const analyzeImage = async (imageUrl: string): Promise<ImageAnalysis> => {
  const [dominantColors, brightness, dimensions] = await Promise.all([
    extractDominantColors(imageUrl),
    calculateBrightness(imageUrl),
    getImageDimensions(imageUrl)
  ]);

  return {
    dominantColors,
    aspectRatio: dimensions.aspectRatio,
    brightness,
    contrast: 0
  };
};

const calculateColorSimilarity = (colors1: string[], colors2: string[]): number => {
  if (colors1.length === 0 || colors2.length === 0) return 0;

  let totalSimilarity = 0;
  let comparisons = 0;

  for (const color1 of colors1.slice(0, 3)) {
    const rgb1 = color1.match(/\d+/g)?.map(Number) || [0, 0, 0];
    
    let bestMatch = 0;
    for (const color2 of colors2.slice(0, 3)) {
      const rgb2 = color2.match(/\d+/g)?.map(Number) || [0, 0, 0];
      
      const distance = Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
        Math.pow(rgb1[1] - rgb2[1], 2) +
        Math.pow(rgb1[2] - rgb2[2], 2)
      );
      
      const similarity = Math.max(0, 100 - (distance / 4.41));
      bestMatch = Math.max(bestMatch, similarity);
    }
    
    totalSimilarity += bestMatch;
    comparisons++;
  }

  return comparisons > 0 ? totalSimilarity / comparisons : 0;
};

const calculateTagSimilarity = (uploadTags: string[], productTags: string[]): number => {
  if (!productTags || productTags.length === 0) return 0;
  
  const commonTags = uploadTags.filter(tag => 
    productTags.some(pTag => pTag.toLowerCase().includes(tag.toLowerCase()))
  );
  
  return (commonTags.length / Math.max(uploadTags.length, productTags.length)) * 100;
};

const generateImageTags = (analysis: ImageAnalysis): string[] => {
  const tags: string[] = [];
  
  for (const color of analysis.dominantColors.slice(0, 3)) {
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const [r, g, b] = rgb;
    
    if (r > 200 && g > 200 && b > 200) tags.push('white', 'light');
    else if (r < 50 && g < 50 && b < 50) tags.push('black', 'dark');
    else if (r > g && r > b) tags.push('red', 'warm');
    else if (g > r && g > b) tags.push('green', 'natural');
    else if (b > r && b > g) tags.push('blue', 'cool');
    else if (r > 100 && g > 100 && b < 100) tags.push('yellow', 'bright');
  }
  
  if (analysis.brightness > 180) tags.push('bright', 'light');
  else if (analysis.brightness < 80) tags.push('dark', 'moody');
  
  if (analysis.aspectRatio > 1.5) tags.push('wide', 'landscape');
  else if (analysis.aspectRatio < 0.8) tags.push('tall', 'portrait');
  else tags.push('square', 'balanced');
  
  return [...new Set(tags)];
};

export const findSimilarProducts = async (imageUrl: string): Promise<SearchResult[]> => {
  try {
    const analysis = await analyzeImage(imageUrl);
    const imageTags = generateImageTags(analysis);
    
    const results: SearchResult[] = [];
    
    for (const product of products) {
      let totalSimilarity = 0;
      let weightSum = 0;
      
      const productAnalysis = await analyzeImage(product.image);
      
      const colorSimilarity = calculateColorSimilarity(analysis.dominantColors, productAnalysis.dominantColors);
      totalSimilarity += colorSimilarity * 0.4;
      weightSum += 0.4;
      
      const brightnessDiff = Math.abs(analysis.brightness - productAnalysis.brightness);
      const brightnessSimilarity = Math.max(0, 100 - (brightnessDiff / 2.55));
      totalSimilarity += brightnessSimilarity * 0.2;
      weightSum += 0.2;
      
      const aspectDiff = Math.abs(analysis.aspectRatio - productAnalysis.aspectRatio);
      const aspectSimilarity = Math.max(0, 100 - (aspectDiff * 50));
      totalSimilarity += aspectSimilarity * 0.2;
      weightSum += 0.2;
      
      const tagSimilarity = calculateTagSimilarity(imageTags, product.tags || []);
      totalSimilarity += tagSimilarity * 0.2;
      weightSum += 0.2;
      
      const finalSimilarity = weightSum > 0 ? totalSimilarity / weightSum : 0;
      
      const randomFactor = Math.random() * 10 - 5;
      const adjustedSimilarity = Math.max(0, Math.min(100, finalSimilarity + randomFactor));
      
      if (adjustedSimilarity > 20) {
        results.push({
          product,
          similarity: Math.round(adjustedSimilarity * 100) / 100
        });
      }
    }
    
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 24);
      
  } catch (error) {
    console.error('Error in findSimilarProducts:', error);
    return [];
  }
};

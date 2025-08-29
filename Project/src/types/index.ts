export interface Product {
  id: string;
  name: string;
  category: string;
  price?: number;
  description: string;
  image: string;
  sourceUrl?: string;
  tags?: string[];
}

export interface SearchResult {
  product: Product;
  similarity: number;
}

export interface ImageAnalysis {
  dominantColors: string[];
  aspectRatio: number;
  brightness: number;
  contrast: number;
}
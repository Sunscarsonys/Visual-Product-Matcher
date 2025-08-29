const IMAGGA_API_KEY = import.meta.env.VITE_IMAGGA_API_KEY;
const IMAGGA_API_SECRET = import.meta.env.VITE_IMAGGA_API_SECRET;

export interface RecognitionResult {
  result: {
    tags: Array<{
      tag: {
        en: string;
      };
      confidence: number;
    }>;
  };
}

export const recognizeImage = async (imageUrl: string): Promise<RecognitionResult> => {
  try {
    if (imageUrl.startsWith('data:')) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('image', blob);
      
      const auth = btoa(`${IMAGGA_API_KEY}:${IMAGGA_API_SECRET}`);
      
      const recognitionResponse = await fetch('https://api.imagga.com/v2/tags', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      
      if (!recognitionResponse.ok) {
        throw new Error('Image recognition failed');
      }
      
      return await recognitionResponse.json();
    } else {
      const auth = btoa(`${IMAGGA_API_KEY}:${IMAGGA_API_SECRET}`);
      const encodedUrl = encodeURIComponent(imageUrl);
      
      const recognitionResponse = await fetch(
        `https://api.imagga.com/v2/tags?image_url=${encodedUrl}`, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      
      if (!recognitionResponse.ok) {
        throw new Error('Image recognition failed');
      }
      
      return await recognitionResponse.json();
    }
  } catch (error) {
    console.error('Recognition error:', error);
    throw new Error('Failed to process image');
  }
};

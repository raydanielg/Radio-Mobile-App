import { Platform } from 'react-native';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  url: string;
  publishedAt: string;
}

const NEWS_SOURCES = [
  'https://api.example.com/news/millardayo',
  'https://api.example.com/news/tanzanianews',
  // Add more news sources here
];

export const fetchNews = async (): Promise<NewsItem[]> => {
  try {
    const newsPromises = NEWS_SOURCES.map(async (source) => {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${source}`);
      }
      return response.json();
    });

    const results = await Promise.all(newsPromises);
    const combinedNews = results.flat().map((item: any) => ({
      id: item.id || Math.random().toString(),
      title: item.title,
      description: item.description,
      imageUrl: item.image_url || 'https://placehold.co/600x400',
      source: item.source,
      url: item.url,
      publishedAt: item.published_at
    }));

    return combinedNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
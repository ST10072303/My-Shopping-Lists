import axios from "axios";

const PIXABAY_API_URL = "https://pixabay.com/api/";
const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

export interface PixabayImage {
  id: number;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
}

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

export const searchPixabayImages = async (searchTerm: string ): Promise<PixabayImage[]> => {
  if (!PIXABAY_API_KEY) {
    throw new Error("Pixabay API key is not configured.");
  }

  if (!searchTerm.trim()) {
    return [];
  }

  const response =
    await axios.get<PixabayResponse>(PIXABAY_API_URL,
      {
        params: {
          key: PIXABAY_API_KEY,
          q: searchTerm,
          image_type: "photo",
          safesearch: true,
          per_page: 10,
          page: 1,
        },
      }
    );

  return response.data.hits;
};
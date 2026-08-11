import axios from 'axios';
import { BASE_URL, API_KEY } from '../constants/config';

// Axios istemcisi (Varsayılan ayarlar)
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'tr-TR', // Türkçe veri çekimi
  },
});

// 1. Trend Filmleri Getir (Ana Sayfa İçin)
export const getTrendingMovies = async () => {
  try {
    const response = await tmdbApi.get('/trending/movie/day');
    return response.data;
  } catch (error) {
    console.error('getTrendingMovies hatası:', error);
    throw error;
  }
};

// 2. Popüler Dizileri Getir (Sayfalamalı / Infinite Scroll Uyumlu)
export const getPopularTvShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/popular', {
      params: {
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('getPopularTvShows hatası:', error);
    throw error;
  }
};

// 3. Sayfalamalı (Paginated) Film Arama (SearchScreen İçin)
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: query,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('searchMovies hatası:', error);
    throw error;
  }
};

// 4. Film Detay Bilgisini Getir (DetailScreen İçin)
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('getMovieDetails hatası:', error);
    throw error;
  }
};

// 5. Film Oyuncu Kadrosunu (Cast) Getir (DetailScreen İçin)
export const getMovieCredits = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    console.error('getMovieCredits hatası:', error);
    throw error;
  }
};
import axios from 'axios';
import { BASE_URL, API_KEY } from '../constants/config';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'tr-TR',
  },
});

export const getTrendingMovies = async () => {
  try {
    const response = await tmdbApi.get('/trending/movie/day');
    return response.data;
  } catch (error) {
    console.error('getTrendingMovies hatası:', error);
    throw error;
  }
};

export const getPopularTvShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('getPopularTvShows hatası:', error);
    throw error;
  }
};

export const searchMulti = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('searchMulti hatası:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page: page,
        sort_by: 'vote_average.desc', 
        'vote_count.gte': 1500,       
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('getMoviesByGenre hatası:', error);
    return { results: [] };
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('getMovieDetails hatası:', error);
    throw error;
  }
};

export const getMovieCredits = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response.data.cast;
  } catch (error) {
    console.error('getMovieCredits hatası:', error);
    throw error;
  }
};

export const getMovieVideos = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response.data.results;
  } catch (error) {
    console.error('getMovieVideos hatası:', error);
    throw error;
  }
};

export default tmdbApi;
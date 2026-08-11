import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import tmdbApi from '../api/tmdb';

const { width } = Dimensions.get('window');

const DetailScreen = ({ route, navigation }) => {
  const { movieId, mediaType = 'movie' } = route.params || {};

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (movieId) {
      fetchData();
      checkSavedStatus();
    }
  }, [movieId, mediaType]);

  const checkSavedStatus = async () => {
    try {
      const favorites = await AsyncStorage.getItem('@favorites');
      const watchlist = await AsyncStorage.getItem('@watchlist');

      const favList = favorites ? JSON.parse(favorites) : [];
      const watchList = watchlist ? JSON.parse(watchlist) : [];

      const isFav = favList.some((item) => String(item.id) === String(movieId));
      const isWatch = watchList.some((item) => String(item.id) === String(movieId));

      setIsFavorite(isFav);
      setIsInWatchlist(isWatch);
    } catch (error) {
      console.error('Kayıt durumları okunamadı:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('@favorites');
      let favList = favorites ? JSON.parse(favorites) : [];

      const exists = favList.some((item) => String(item.id) === String(movieId));

      if (exists) {
        favList = favList.filter((item) => String(item.id) !== String(movieId));
        await AsyncStorage.setItem('@favorites', JSON.stringify(favList));
        setIsFavorite(false);
      } else {
        const newItem = {
          id: movieId,
          title: details?.title || details?.name || 'İsimsiz İçerik',
          poster_path: details?.poster_path || '',
          vote_average: details?.vote_average || 0,
          mediaType: mediaType,
        };

        favList.push(newItem);
        await AsyncStorage.setItem('@favorites', JSON.stringify(favList));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Favori kaydedilemedi:', error);
      Alert.alert('Hata', 'Favorilere eklenirken bir sorun oluştu.');
    }
  };

  const toggleWatchlist = async () => {
    try {
      const watchlist = await AsyncStorage.getItem('@watchlist');
      let watchList = watchlist ? JSON.parse(watchlist) : [];

      const exists = watchList.some((item) => String(item.id) === String(movieId));

      if (exists) {
        watchList = watchList.filter((item) => String(item.id) !== String(movieId));
        await AsyncStorage.setItem('@watchlist', JSON.stringify(watchList));
        setIsInWatchlist(false);
      } else {
        const newItem = {
          id: movieId,
          title: details?.title || details?.name || 'İsimsiz İçerik',
          poster_path: details?.poster_path || '',
          vote_average: details?.vote_average || 0,
          mediaType: mediaType,
        };

        watchList.push(newItem);
        await AsyncStorage.setItem('@watchlist', JSON.stringify(watchList));
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('İzlenecekler kaydedilemedi:', error);
      Alert.alert('Hata', 'İzleneceklere eklenirken bir sorun oluştu.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const type = mediaType === 'tv' ? 'tv' : 'movie';

      const [detailsRes, creditsRes, videosRes] = await Promise.all([
        tmdbApi.get(`/${type}/${movieId}`),
        tmdbApi.get(`/${type}/${movieId}/credits`),
        tmdbApi.get(`/${type}/${movieId}/videos`, { params: { language: 'en-US' } }),
      ]);

      setDetails(detailsRes.data);
      setCast(creditsRes.data.cast || []);

      const videos = videosRes.data.results || [];
      
      const youtubeVideos = videos.filter((v) => v.site === 'YouTube');
      
      const officialTrailer = youtubeVideos.find(
        (v) => v.type === 'Trailer' || v.type === 'Teaser'
      );
      
      if (officialTrailer) {
        setTrailerKey(officialTrailer.key);
      } else if (youtubeVideos.length > 0) {
        setTrailerKey(youtubeVideos[0].key);
      }
    } catch (error) {
      console.error('Detay verisi çekilirken hata oluştu:', error?.response?.status || error.message);
    } finally {
      setLoading(false);
    }
  };

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      setIsModalVisible(false);
    }
  }, []);

  const openTrailerModal = () => {
    if (trailerKey) {
      setPlaying(true);
      setIsModalVisible(true);
    } else {
      Alert.alert('Bilgi', 'Bu içerik için henüz bir fragman bulunamadı.');
    }
  };

  const closeTrailerModal = () => {
    setPlaying(false);
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: details?.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${details.backdrop_path}`
              : details?.poster_path
              ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
              : 'https://via.placeholder.com/500x250?text=Gorsel+Yok',
          }}
          style={styles.backdropImage}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite} activeOpacity={0.7}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#E50914' : '#FFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={toggleWatchlist} activeOpacity={0.7}>
            <Ionicons
              name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isInWatchlist ? '#E50914' : '#FFF'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{details?.title || details?.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.rating}>⭐ {details?.vote_average ? details.vote_average.toFixed(1) : 'N/A'} / 10</Text>
          <Text style={styles.releaseDate}>
            📅 {details?.release_date || details?.first_air_date || 'Bilinmiyor'}
          </Text>
          {details?.runtime ? <Text style={styles.runtime}>{details.runtime} dk</Text> : null}
        </View>

        <View style={styles.genreContainer}>
          {details?.genres?.map((genre) => (
            <View key={genre.id} style={styles.genreBadge}>
              <Text style={styles.genreText}>{genre.name}</Text>
            </View>
          ))}
        </View>

        {trailerKey && (
          <TouchableOpacity style={styles.trailerButton} onPress={openTrailerModal} activeOpacity={0.8}>
            <Ionicons name="logo-youtube" size={22} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.trailerButtonText}>Fragmanı İzle</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Özet</Text>
        <Text style={styles.overview}>
          {details?.overview || 'Bu içerik için henüz bir özet eklenmemiş.'}
        </Text>

        {cast.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Oyuncular</Text>
            <FlatList
              horizontal
              data={cast}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.castCard}>
                  <Image
                    source={{
                      uri: item.profile_path
                        ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                        : 'https://via.placeholder.com/100x150?text=Gorsel+Yok',
                    }}
                    style={styles.castImage}
                  />
                  <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.castCharacter} numberOfLines={1}>{item.character}</Text>
                </View>
              )}
            />
          </>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeTrailerModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeTrailerModal}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>

            {trailerKey && (
              <YoutubePlayer
                height={230}
                width={width - 32} 
                play={playing}
                videoId={trailerKey}
                onChangeState={onStateChange}
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0609', 
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1A0609',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 45,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  rating: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  releaseDate: {
    color: '#AAAAAA',
  },
  runtime: {
    color: '#AAAAAA',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  genreBadge: {
    backgroundColor: '#260B10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  genreText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  trailerButton: {
    flexDirection: 'row',
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  trailerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
  },
  overview: {
    color: '#BBBBBB',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  castCard: {
    width: 90,
    marginRight: 12,
    alignItems: 'center',
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
  },
  castName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  castCharacter: {
    color: '#888888',
    fontSize: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#1A0609',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 4,
  },
});

export default DetailScreen;
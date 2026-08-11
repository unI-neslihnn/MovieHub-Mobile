import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { IMAGE_BASE_URL, BASE_URL, API_KEY } from '../constants/config';
import axios from 'axios';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/search/multi`, {
        params: {
          api_key: API_KEY,
          query: text,
          language: 'tr-TR',
        },
      });

      const filteredResults = (response.data.results || []).filter(
        (item) => item.poster_path || item.profile_path || item.backdrop_path
      );
      setResults(filteredResults);
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchItem = ({ item }) => {
    const isMovie = item.media_type === 'movie';
    const isTv = item.media_type === 'tv';
    const isPerson = item.media_type === 'person';

    const title = item.title || item.name || 'İsimsiz İçerik';
    const imagePath = isPerson ? item.profile_path : item.poster_path;

    const dateInfo = isMovie
      ? item.release_date ? item.release_date.split('-')[0] : 'Tarih Yok'
      : isTv
      ? item.first_air_date ? item.first_air_date.split('-')[0] : 'Tarih Yok'
      : item.known_for_department || 'Oyuncu/Kişi';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          if (isMovie || isTv) {
            navigation.navigate('Detail', {
              movieId: item.id,
              mediaType: isTv ? 'tv' : 'movie',
            });
          }
        }}
      >
        <Image
          source={{
            uri: imagePath
              ? `${IMAGE_BASE_URL}${imagePath}`
              : 'https://via.placeholder.com/150x225/111/fff?text=Görsel+Yok',
          }}
          style={styles.poster}
        />
        <View style={styles.infoContainer}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {isMovie ? '🎬 Film' : isTv ? '📺 Dizi' : '👤 Oyuncu'}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.date}>{dateInfo}</Text>

          {!isPerson && (
            <>
              <Text style={styles.overview} numberOfLines={2}>
                {item.overview || 'Açıklama bulunmuyor.'}
              </Text>
              <Text style={styles.rating}>
                ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Film, dizi veya oyuncu ara..."
              placeholderTextColor="#888"
              value={query}
              onChangeText={handleSearch}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#E50914" />
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => `${item.media_type}-${item.id}`}
            renderItem={renderSearchItem}
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
          />
        ) : (

          <View style={styles.emptyContainer}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop',
              }}
              style={styles.backgroundImage}
              imageStyle={styles.backgroundImageStyle}
            >
              <View style={styles.emptyOverlay}>
                <Ionicons name="film-outline" size={70} color="rgba(229, 9, 20, 0.6)" />
                <Text style={styles.emptyTitle}>Sinema Dünyasında Ara</Text>
                <Text style={styles.emptySubtitle}>
                  Binlerce film, dizi ve oyuncu arasından dilediğini bulmak için yukarıdaki arama çubuğunu kullanabilirsin.
                </Text>
              </View>
            </ImageBackground>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0609' },
  searchSection: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E',
    borderRadius: 10, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, color: '#FFF', fontSize: 15 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    flexDirection: 'row', backgroundColor: '#1E1E1E', borderRadius: 8,
    marginBottom: 12, overflow: 'hidden', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  poster: { width: 85, height: 125 },
  infoContainer: { flex: 1, padding: 12 },
  badgeContainer: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(229, 9, 20, 0.2)', paddingHorizontal: 8,
    paddingVertical: 2, borderRadius: 4, marginBottom: 6, borderWidth: 1, borderColor: 'rgba(229, 9, 20, 0.5)',
  },
  badgeText: { color: '#E50914', fontSize: 11, fontWeight: 'bold' },
  title: { color: '#FFF', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  date: { color: '#888', fontSize: 12, marginBottom: 4 },
  overview: { color: '#AAA', fontSize: 12, marginBottom: 6 },
  rating: { color: '#FFD700', fontSize: 13, fontWeight: '600' },
  emptyContainer: { flex: 1 },
  backgroundImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundImageStyle: { opacity: 0.45, resizeMode: 'cover' },
  emptyOverlay: { alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, textAlign: 'center' },
  emptySubtitle: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
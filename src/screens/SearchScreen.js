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
import { IMAGE_BASE_URL } from '../constants/config';
import axios from 'axios';
import { BASE_URL, API_KEY } from '../constants/config';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // TMDB Film Arama Fonksiyonu
  const handleSearch = async (text) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: text,
          language: 'tr-TR',
        },
      });
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Detail', { movie: item })}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : 'https://via.placeholder.com/150x225/111/fff?text=Görsel+Yok',
        }}
        style={styles.poster}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.date}>
          {item.release_date ? item.release_date.split('-')[0] : 'Tarih Yok'}
        </Text>
        <Text style={styles.overview} numberOfLines={2}>
          {item.overview || 'Açıklama bulunmuyor.'}
        </Text>
        <Text style={styles.rating}>⭐ {item.vote_average?.toFixed(1) || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        
        {/* Arama Alanı (Üstten biraz mesafe bırakarak konumlandırıldı) */}
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

        {/* Sonuç Alanı VEYA Silik Sinema Arka Planı */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#E50914" />
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovieItem}
            contentContainerStyle={styles.listContainer}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          /* Arama Yapılmadığında Görünen Silik Sinema Teması */
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
                  Binlerce film arasından dilediğini bulmak için yukarıdaki arama çubuğunu kullanabilirsin.
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
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 24, // Arama barını en üstten biraz aşağıya indiren kısım
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  poster: {
    width: 80,
    height: 120,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    color: '#888',
    fontSize: 12,
    marginBottom: 6,
  },
  overview: {
    color: '#AAA',
    fontSize: 12,
    marginBottom: 8,
  },
  rating: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },
  // Silik Arka Plan Görseli Stilleri
  emptyContainer: {
    flex: 1,
    marginTop: 10,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.18, // Görseli silikleştiren ayar (0.18)
    resizeMode: 'cover',
  },
  emptyOverlay: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
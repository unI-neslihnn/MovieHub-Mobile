import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Arama metni değiştiğinde sıfırdan arama yap
  const handleSearch = async (text) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setPage(1); // Sayfayı sıfırla
      const data = await searchMovies(text, 1);
      setResults(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sonsuz Scroll (Infinite Scroll) - Sayfa Altına Gelindiğinde Tetiklenir
  const loadMoreData = async () => {
    // Eğer zaten yükleniyorsa veya son sayfaya geldiysek veya arama kutusu boşsa çalışma
    if (loadingMore || page >= totalPages || query.trim().length === 0) {
      return;
    }

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await searchMovies(query, nextPage);
      
      // Eski verilerin üzerine yeni gelenleri ekle
      setResults((prevResults) => [...prevResults, ...(data.results || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error('Daha fazla veri çekilemedi:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Alt Kısımda Yükleniyor Simgesi Render Eden Fonksiyon
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#E50914" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Arama Barı */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Film veya dizi ara..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={handleSearch}
          />
          {query.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color="#888"
              onPress={() => handleSearch('')}
            />
          )}
        </View>

        {/* Sonuç Listesi */}
        {loading ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color="#E50914" />
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={60} color="#444" />
            <Text style={styles.emptyText}>
              {query.length > 0
                ? 'Aradığınız içerik bulunamadı.'
                : 'Aramak istediğiniz film veya dizinin adını yazın.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            numColumns={2} // 2'li Grid Sıralama
            columnWrapperStyle={styles.rowWrapper}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <MovieCard
                item={item}
                isHorizontal={false}
                onPress={() => navigation.navigate('Detail', { movieId: item.id })}
              />
            )}
            onEndReached={loadMoreData} // Listenin sonuna gelindiğinde çalışır
            onEndReachedThreshold={0.5} // Listenin %50'sine gelince yeni sayfayı tetikler
            ListFooterComponent={renderFooter} // En alta yükleme simgesi koyar
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  rowWrapper: {
    justifyContent: 'space-between',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
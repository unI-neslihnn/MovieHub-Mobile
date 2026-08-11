import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getTrendingMovies,
  getPopularTvShows,
  getMoviesByGenre,
} from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Skeleton from '../components/Skeleton';

const CategoryRow = ({ title, fetchFn, mediaType, navigation }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const res = await fetchFn(1);
      const results = res?.results || (Array.isArray(res) ? res : []);
      setItems(results);
      setPage(1);
      setHasMore(res?.page < res?.total_pages);
    } catch (error) {
      console.error(`${title} verileri çekilemedi:`, error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await fetchFn(nextPage);
      const newItems = res?.results || (Array.isArray(res) ? res : []);

      if (newItems.length > 0) {
        setItems((prevItems) => {
          const existingIds = new Set(prevItems.map((item) => item.id));
          const filteredNewItems = newItems.filter((item) => !existingIds.has(item.id));
          return [...prevItems, ...filteredNewItems];
        });
        setPage(nextPage);
        setHasMore(res?.page < res?.total_pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(`${title} için daha fazla veri çekilemedi:`, error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={{ flexDirection: 'row', paddingLeft: 16 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={130} height={190} style={{ marginRight: 12 }} />
          ))}
        </View>
      </View>
    );
  }

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingLeft: 16 }}
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            isHorizontal={true}
            onPress={() =>
              navigation.navigate('Detail', {
                movieId: item.id,
                mediaType: mediaType,
              })
            }
          />
        )}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.rowLoader}>
              <ActivityIndicator size="small" color="#E50914" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const SECTIONS = [
    {
      id: 'trending',
      title: 'Trend Filmler',
      mediaType: 'movie',
      fetchFn: async () => await getTrendingMovies(),
    },
    {
      id: 'popular_tv',
      title: 'Popüler Diziler',
      mediaType: 'tv',
      fetchFn: async (page) => await getPopularTvShows(page),
    },
    {
      id: 'action',
      title: 'Aksiyon',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(28, page),
    },
    {
      id: 'adventure',
      title: 'Macera',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(12, page),
    },
    {
      id: 'animation',
      title: 'Animasyon',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(16, page),
    },
    {
      id: 'scifi',
      title: 'Bilim Kurgu',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(878, page),
    },
    {
      id: 'comedy',
      title: 'Komedi',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(35, page),
    },
    {
      id: 'crime',
      title: 'Suç ve Polisiye',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(80, page),
    },
    {
      id: 'drama',
      title: 'Dram',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(18, page),
    },
    {
      id: 'fantasy',
      title: 'Fantastik',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(14, page),
    },
    {
      id: 'horror',
      title: 'Korku',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(27, page),
    },
    {
      id: 'romance',
      title: 'Romantik',
      mediaType: 'movie',
      fetchFn: async (page) => await getMoviesByGenre(10749, page),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.marvelBox}>
            <Text style={styles.marvelText}>MOVIEHUB</Text>
          </View>
        </View>

        <FlatList
          data={SECTIONS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <CategoryRow
              title={item.title}
              fetchFn={item.fetchFn}
              mediaType={item.mediaType}
              navigation={navigation}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A0609',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    backgroundColor: '#1A0609',
  },
  marvelBox: {
    backgroundColor: '#E50914',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  marvelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  rowLoader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 190,
    marginRight: 16,
  },
});
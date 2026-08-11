import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { getTrendingMovies, getPopularTvShows } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Skeleton from '../components/Skeleton';

export default function HomeScreen({ navigation }) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [tvPage, setTvPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const onEndReachedCalledDuringMomentum = useRef(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      setTvPage(1);
      const [moviesRes, tvRes] = await Promise.all([
        getTrendingMovies(),
        getPopularTvShows(1),
      ]);
      setTrendingMovies(moviesRes.results || []);
      setPopularTv(tvRes.results || []);
      setHasMore(tvRes.page < tvRes.total_pages);
    } catch (error) {
      console.error('Ana sayfa verileri çekilemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreTvShows = async () => {
    if (onEndReachedCalledDuringMomentum.current || loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);
      onEndReachedCalledDuringMomentum.current = true;

      const nextPage = tvPage + 1;
      const tvRes = await getPopularTvShows(nextPage);
      const newItems = tvRes.results || [];

      if (newItems.length > 0) {
        setPopularTv((prevTv) => {
          const existingIds = new Set(prevTv.map((item) => item.id));
          const filteredNewItems = newItems.filter((item) => !existingIds.has(item.id));
          return [...prevTv, ...filteredNewItems];
        });
        setTvPage(nextPage);
        setHasMore(nextPage < tvRes.total_pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Daha fazla dizi çekilemedi:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderHeader = () => (
    <>
      {/* Birebir Marvel Tasarımlı Logo */}
      <View style={styles.header}>
        <View style={styles.marvelBox}>
          <Text style={styles.marvelText}>MOVIEHUB</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Trend Filmler</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={trendingMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard
              item={item}
              isHorizontal={true}
              onPress={() => navigation.navigate('Detail', { movieId: item.id })}
            />
          )}
        />
      </View>

      <Text style={styles.sectionTitle}>📺 Popüler Diziler</Text>
    </>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#E50914" />
      </View>
    );
  };

  const renderSkeletons = () => (
    <View style={styles.skeletonContainer}>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} width={140} height={210} style={{ marginRight: 12 }} />
        ))}
      </View>
      <View style={styles.gridSkeleton}>
        {[1, 2, 3, 4].map((_, i) => (
          <Skeleton key={i} width="48%" height={250} style={{ marginBottom: 16 }} />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading ? (
          renderSkeletons()
        ) : (
          <FlatList
            data={popularTv}
            numColumns={2}
            columnWrapperStyle={styles.rowWrapper}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MovieCard
                item={item}
                isHorizontal={false}
                onPress={() => navigation.navigate('Detail', { movieId: item.id })}
              />
            )}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            onEndReached={loadMoreTvShows}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />
            }
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
  },
  header: {
    paddingTop: 25,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  // Doğrudan kutucuğun boyutunu ve kavisini ayarladığımız alan:
  marvelBox: {
    backgroundColor: '#E50914',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4, // İstediğin tatlı köşe kavisi
    alignSelf: 'flex-start', // Kutuyu ekrana yaymaz, sadece içeriği kadar tutar
  },
  marvelText: {
    color: '#FFFFFF',
    fontSize: 18, // Kutunun boyutunu belirleyen ana metin ölçeği
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  rowWrapper: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  skeletonContainer: {
    marginTop: 10,
  },
  gridSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
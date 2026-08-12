import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { IMAGE_BASE_URL } from '../constants/config';

export default function WatchlistScreen({ navigation }) {
  const [watchlist, setWatchlist] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadWatchlist();
    }, [])
  );

  const loadWatchlist = async () => {
    try {
      const savedList = await AsyncStorage.getItem('@watchlist');
      if (savedList) {
        setWatchlist(JSON.parse(savedList));
      } else {
        setWatchlist([]);
      }
    } catch (error) {
      console.error('İzlenecekler listesi yüklenemedi:', error);
    }
  };

  const removeFromWatchlist = async (id) => {
    try {
      const updatedList = watchlist.filter((item) => String(item.id) !== String(id));
      setWatchlist(updatedList);
      await AsyncStorage.setItem('@watchlist', JSON.stringify(updatedList));
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('Detail', {
          movieId: item.id,
          mediaType: item.mediaType || 'movie',
        })
      }
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
          {item.title || item.name}
        </Text>
        <Text style={styles.rating}>
          ⭐ {item.vote_average ? Number(item.vote_average).toFixed(1) : 'N/A'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromWatchlist(item.id)}
      >
        <Ionicons name="trash-outline" size={22} color="#E50914" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>İzlenecekler Listem</Text>

      {watchlist.length > 0 ? (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={80} color="#444" />
          <Text style={styles.emptyText}>Henüz listenize film eklemediniz.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0609',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    overflow: 'hidden',
    paddingRight: 12,
  },
  poster: {
    width: 70,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  rating: {
    color: '#FFD700',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 12,
  },
});
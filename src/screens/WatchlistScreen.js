import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { IMAGE_BASE_URL } from '../constants/config';
import { Ionicons } from '@expo/vector-icons';

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
      const updatedList = watchlist.filter((item) => item.id !== id);
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
      onPress={() => navigation.navigate('Detail', { movie: item })}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : 'https://via.placeholder.com/150',
        }}
        style={styles.poster}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || item.name}
        </Text>
        <Text style={styles.overview} numberOfLines={2}>
          {item.overview || 'Açıklama bulunmuyor.'}
        </Text>
        <Text style={styles.rating}>⭐ {item.vote_average?.toFixed(1) || 'N/A'}</Text>
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
      <Text style={styles.headerTitle}>İzlenecekler Listem </Text>

      {watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color="#555" />
          <Text style={styles.emptyText}>Henüz listenize film eklemediniz.</Text>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
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
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
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
  listContainer: {
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
  deleteButton: {
    padding: 16,
  },
});
import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IMAGE_BASE_URL } from '../constants/config';

export default function MovieCard({ item, onPress, isHorizontal = false }) {
  const title = item.title || item.name || 'İsimsiz İçerik';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  
  const posterPath = item.poster_path 
    ? `${IMAGE_BASE_URL}${item.poster_path}` 
    : null;

  return (
    <TouchableOpacity
      style={[styles.card, isHorizontal ? styles.horizontalCard : styles.verticalCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {posterPath ? (
        <Image 
          source={{ uri: posterPath }} 
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.noImage]}>
          <Ionicons name="film-outline" size={32} color="#666" />
          <Text style={styles.noImageText}>Görsel Yok</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  horizontalCard: {
    width: 140,
    marginRight: 12,
  },
  verticalCard: {
    width: '48%', 
  },
  poster: {
    width: '100%',
    height: 210,
    backgroundColor: '#2A2A2A',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    color: '#AAA',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
});
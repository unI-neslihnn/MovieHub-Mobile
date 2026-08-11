import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>İzleme Listem & Favoriler</Text>
        <Text style={styles.subtitle}>Henüz favori film eklemediniz.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#121212' },
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 14 },
});
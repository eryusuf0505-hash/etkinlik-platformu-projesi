import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function EventCard({ category, date, time, title, description, location }) {
  return (
    <View style={styles.card}>
      {/* Üst Kısım: Kategori ve Tarih */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{category}</Text>
        </View>
        <Text style={styles.dateTime}>{date} • {time}</Text>
      </View>

      {/* Orta Kısım: Başlık ve Açıklama */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      {/* Alt Kısım: Konum ve Buton */}
      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>
        
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>İncele</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // iOS Gölgeleri
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android Gölgeleri
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#3182CE',
    fontSize: 12,
    fontWeight: '700',
  },
  dateTime: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
    paddingTop: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#3182CE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
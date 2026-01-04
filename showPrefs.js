import React from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: StatusBar.currentHeight || 0, padding: 16 },
  recommendationCard: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  text: { fontSize: 14, marginVertical: 2, color: '#333' },
  ingredientText: { fontSize: 14, marginVertical: 1, color: '#555' },
});

export default function PreferencePage({ top_recipes }) {
  return (
    <ScrollView style={styles.container}>
      {top_recipes.length === 0 && (
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20 }}>
          No recommendations yet.
        </Text>
      )}

      {top_recipes.map((item, index) => (
        <View key={item.id || index} style={styles.recommendationCard}>
          {item.image_url && (
            <Image
              source={{ uri: item.image_url }}
              style={{ width: '100%', height: 150, borderRadius: 10, marginBottom: 8 }}
              resizeMode="cover"
            />
          )}

          <Text style={styles.title}>{item.recipe_title}</Text>

          {item.ingredients && item.ingredients.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Ingredients:</Text>
              {item.ingredients.map((ing, i) => (
                <Text key={i} style={styles.ingredientText}>
                  • {ing}
                </Text>
              ))}
            </>
          )}

          {item.directions && item.directions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Directions:</Text>
              {item.directions.map((step, i) => (
                <Text key={i} style={styles.text}>
                  {i + 1}. {step}
                </Text>
              ))}
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}



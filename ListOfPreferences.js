import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  View,
  Image,
} from 'react-native';
import supabase from './supa';
import PreferencePage from './showPrefs';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// 🔹 Sample ingredient data
const DATA = [
  { id: '1', title: 'Apple' },
  { id: '2', title: 'Banana' },
  { id: '3', title: 'Bread' },
  { id: '4', title: 'Rice' },
  { id: '5', title: 'Eggs' },
  { id: '6', title: 'Milk' },
  { id: '7', title: 'Chicken' },
  { id: '8', title: 'Carrot' },
  { id: '9', title: 'Potato' },
  { id: '10', title: 'Cheese' },
];

// 🔹 Item component for ingredient selection
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: StatusBar.currentHeight || 0 },
  item: { padding: 20, marginVertical: 8, marginHorizontal: 16, borderRadius: 8 },
  title: { fontSize: 20 },
  recommendationCard: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

// 🔹 Main component
export default function Preferences({ user, id, onRecommendations }) {
  const [selected, setSelected] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // 🔹 Toggle ingredient selection
  const renderItem = ({ item }) => {
    const isSelected = selected.some(i => i.id === item.id);

    return (
      <Item
        item={item}
        onPress={() => {
          setSelected(prev =>
            isSelected ? prev.filter(i => i.id !== item.id) : [...prev, item]
          );
        }}
        backgroundColor={isSelected ? '#6e3b6e' : '#f9c2ff'}
        textColor={isSelected ? 'white' : 'black'}
      />
    );
  };

  // 🔹 Submit preferences to API
  const submit = async () => {
    if (!user) return Alert.alert("You must be logged in");
    console.log("Submitting preferences");
    if (!selected || selected.length === 0) {
      return Alert.alert("Please select at least one preference");
    }
    const titles = selected.map(i => i.title);

    console.log("Request body:", JSON.stringify({
      id: id,
      name: 'Test',
      preferences: titles,
    }));

    try {
      const res = await fetch('http://192.168.7.95:8000/recommend', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          name: 'Test',
          preferences: titles,
        }),
      });
      console.log("Response received");
      const data = await res.json();
      console.log(data)
      onRecommendations(data.top_recipes)

    } catch (error) {
      console.error(error);
      Alert.alert("Error fetching recommendations");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 18, margin: 10 }}>
          Logged in as {user?.email || 'Guest'}
        </Text>

        <Button title="Log Out" onPress={() => supabase.auth.signOut()} />

        <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 10 }}>
          Select Ingredients
        </Text>

        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selected}
        />

        <Button title="Get Recommendations" onPress={submit} />
        {recommendations.length > 0 && (
          <PreferencePage top_recipes={recommendations} />
        )}

        {/* {recommendations.length > 0 && (
          <>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 10 }}>
              Recommendations
            </Text>
            <FlatList
              data={recommendations}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({ item }) => (
                <View style={styles.recommendationCard}>
                  {item.image_url && (
                    <Image
                      source={{ uri: item.image_url }}
                      style={{ width: '100%', height: 150, borderRadius: 10, marginBottom: 8 }}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.recipe_title}</Text>
                  {item.ingredients && (
                    <Text style={{ marginTop: 4, color: '#555' }}>
                      {item.ingredients.join(', ')}
                    </Text>
                  )}
                </View>
              )}
            />
          </>
        )} */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

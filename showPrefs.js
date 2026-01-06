import React, { useState } from "react";
import { FlatList, View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

export default function PreferencePage({ top_recipes }) {
  return (
    <FlatList
      data={top_recipes}
      keyExtractor={(item, i) => item.id?.toString() || i.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToAlignment="center"
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 12 }}
      renderItem={({ item }) => <RecipeCard item={item} />}
    />
  );
}

function RecipeCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  const directionsArray = item.directions
    ? Array.isArray(item.directions)
      ? item.directions
      : item.directions.split("\n")
    : [];

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(!expanded)}>
      <View style={[styles.card, expanded && styles.cardExpanded]}>
        {/* Image + title always visible */}
        <Image
          source={{
            uri:
              item.image_url ||
              "https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M="
          }}
          style={[styles.image, expanded && styles.imageExpanded]}
          resizeMode="cover"
        />
        <Text style={styles.title}>{item.recipe_title}</Text>

        {/* Only show badges if collapsed */}
        {!expanded && item.category && (
          <View style={styles.badgeRow}>
            {item.category && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            )}
            {item.subcategory && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.subcategory}</Text>
              </View>
            )}
          </View>
        )}

        {/* Expanded content */}
        {expanded && (
          <View style={{ marginTop: 10 }}>
            {item.ingredients?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                {item.ingredients.map((ing, i) => (
                  <Text key={i} style={styles.ingredientText}>
                    • {ing}
                  </Text>
                ))}
              </>
            )}

            {directionsArray.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Directions</Text>
                {directionsArray.map((step, i) => (
                  <Text key={i} style={styles.text}>
                    {i + 1}. {step}
                  </Text>
                ))}
              </>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.3,       // 70% of screen width
    marginHorizontal: width * 0.025,
    borderRadius: 14,
    padding: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignItems: "center",
  },
  cardExpanded: {
    width: width * 0.5,      // 85% when expanded
    padding: 14,
  },
  image: {
    width: "100%",
    height: width * 0.1,     // height proportional to width (~16:9)
    borderRadius: 12,
    marginBottom: 6,
  },
  imageExpanded: {
    height: width * 0.2,     // taller when expanded
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 4, flexWrap: "wrap" },
  badge: { backgroundColor: "#E0EAFF", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  badgeText: { color: "#1D4ED8", fontSize: 11, fontWeight: "600" },
  sectionTitle: { fontSize: 14, fontWeight: "600", marginTop: 8, marginBottom: 4, color: "#2563EB" },
  ingredientText: { fontSize: 13, color: "#4B5563", lineHeight: 18 },
  text: { fontSize: 13, color: "#374151", lineHeight: 18 },
});

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_GAP = 8;
const ITEM_WIDTH = (width - ITEM_GAP * 8) / 6; // ~6 visible cards

export default function PreferencePage({ top_recipes = [] }) {
  // --- Build rails automatically here ---
  const rails = useMemo(() => {
    const chunk = (arr, size) =>
      arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

    const groups = chunk(top_recipes, 12); // 12 per row (scrollable)

    const titles = [
      "Top Trends",
      "Recommended For You",
      "Because You Liked These",
      "High-Protein Picks",
      "Quick & Easy",
      "New This Week",
    ];

    return titles.map((title, i) => ({
      title,
      data: groups[i] ?? [],
    }));
  }, [top_recipes]);

  return (
    <FlatList
      data={rails}
      keyExtractor={(item) => item.title}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.railSection}>
          <Text style={styles.railTitle}>{item.title}</Text>

          <FlatList
            data={item.data}
            keyExtractor={(r, i) => r.id?.toString() || i.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: ITEM_GAP }} />}
            renderItem={({ item }) => <RecipeCard item={item} />}
          />
        </View>
      )}
    />
  );
}

function RecipeCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  const directionsArray = item?.directions
    ? Array.isArray(item.directions)
      ? item.directions
      : item.directions.split("\n")
    : [];

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => setExpanded(!expanded)}>
      <View style={[styles.card, expanded && styles.cardExpanded]}>
        <Image
          source={{
            uri:
              item?.image_url ||
              "https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=",
          }}
          style={[styles.image, expanded && styles.imageExpanded]}
          resizeMode="cover"
        />

        <Text numberOfLines={2} style={styles.title}>
          {item?.recipe_title}
        </Text>

        {!expanded && item?.category && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
        )}

        {expanded && (
          <View style={{ marginTop: 6 }}>
            {item?.ingredients?.slice(0, 3).map((ing, i) => (
              <Text key={i} style={styles.meta}>
                • {ing}
              </Text>
            ))}

            {directionsArray.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Directions</Text>
                {directionsArray.slice(0, 2).map((step, i) => (
                  <Text key={i} style={styles.meta}>
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
  railSection: {
    marginBottom: 26,
    paddingHorizontal: 12,
  },
  railTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },

  card: {
    width: ITEM_WIDTH,
    borderRadius: 12,
    padding: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: "center",
  },
  cardExpanded: { width: ITEM_WIDTH * 1.3 },

  image: {
    width: "100%",
    height: ITEM_WIDTH * 0.75,
    borderRadius: 10,
    marginBottom: 6,
  },
  imageExpanded: { height: ITEM_WIDTH },

  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  badge: {
    marginTop: 4,
    backgroundColor: "#E0EAFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: { color: "#1D4ED8", fontSize: 10, fontWeight: "600" },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
    color: "#2563EB",
  },
  meta: { fontSize: 11, color: "#4B5563", lineHeight: 16 },
});

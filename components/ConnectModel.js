import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const headers = {"Recommended For You": [], 
    "Top Matches For Your Taste": [], "Keep Exploring": []

}

const MyListItem = ({ item }) => (
  <View style={{ padding: 5, borderColor: '#ccc', flexDirection: "row" }}>
    <Image 
      source={item.image}
      style={{ width: 150, height: 150 }}
      resizeMode="contain"
    />
  </View>
);


const ConnectModel = () => {
  const data = [
    { id: '1', name: 'Item A', image: require('../assets/food_1.jpg') },
    { id: '2', name: 'Item B', image: require('../assets/food_2.jpg') },
    { id: '3', name: 'Item C', image: require('../assets/food_3.jpg') },
  ];

  const data2 = [
    { id: '1', name: 'Item A', image: require('../assets/food_1.jpg') },
    { id: '2', name: 'Item B', image: require('../assets/food_2.jpg') },
    { id: '3', name: 'Item C', image: require('../assets/food_3.jpg') },
  ]

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View style = {styles.row}>
          {data.map((item) => (
            <MyListItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View style = {styles.row}>
          {data.map((item) => (
            <MyListItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View style = {styles.row}>
          {data.map((item) => (
            <MyListItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View style = {styles.row}>
          {data.map((item) => (
            <MyListItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
  )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },

    row: {
      flexDirection: "row",
      alignItems: "top",
    },
    scrollView: {
        backgroundColor: 'black',
    },
    text: {
        fontSize: 42,
        padding: 12,
        
    },
})

export default ConnectModel
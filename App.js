import React, {useState} from 'react';
import { StyleSheet, View, Text, Image, Button, Alert, TouchableOpacity } from 'react-native';
import ConnectModel from "./components/ConnectModel"


export const likedItems = []

const dislikedItems = []

const foods = [
  require('./assets/fries.webp'),
  require('./assets/RedDot_Burger.jpg'),
];


const App = () => {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const handlePressLike = () => {
    likedItems.push(foods[index])
    console.log("like button pressed")
    showNextItem()
  };
  const handlePressDislike = () => {
    dislikedItems.push(foods[index])
    showNextItem()
  }

  const showNextItem = () => {
    if (index < foods.length - 1) {
      setIndex(index + 1)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return <ConnectModel />
  }

  return (
    <View style={styles.containerMain}>
      <View style = {styles.mainView}>
        <Text style = {styles.textStyle}>Yes or No?</Text>
      </View>
        <Image 
          source={foods[index]} 
          style={styles.picView} 
          resizeMode="contain"
        />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.likeButton} onPress={handlePressLike}>
          <Text style={styles.likeButtonText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dislikeButton} onPress={handlePressDislike}>
          <Text style={styles.dislikeButtonText}>Dislike</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  //return <ConnectModel />;
};


const styles = StyleSheet.create({
  containerMain: {
    flex: 1, // Ensures the main container takes up all available space
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingTop: 100,
    paddingBottom: 100,
  },
  mainView: {
    alignItems: 'center',
  },
  picView: {
    width: '90%',
    height: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    
    resizeMode: 'contain',
  },
  textStyle: {
    color: 'black',
    fontSize: 30,
  },
  buttonContainer: {
    bottom: 40,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeButton: {
    backgroundColor: 'lightgreen',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 10,
  },
  dislikeButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 10,
  }
});

export default App;
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  View,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import supabase from './supa';
import SignInScreen from './loginScreen';

const DATA = [
  {
    id: '1a2b3c4d-0001-0000-0000-000000000001',
    title: 'Apple',
  },
  {
    id: '1a2b3c4d-0002-0000-0000-000000000002',
    title: 'Banana',
  },
  {
    id: '1a2b3c4d-0003-0000-0000-000000000003',
    title: 'Bread',
  },
  {
    id: '1a2b3c4d-0004-0000-0000-000000000004',
    title: 'Rice',
  },
  {
    id: '1a2b3c4d-0005-0000-0000-000000000005',
    title: 'Eggs',
  },
  {
    id: '1a2b3c4d-0006-0000-0000-000000000006',
    title: 'Milk',
  },
  {
    id: '1a2b3c4d-0007-0000-0000-000000000007',
    title: 'Chicken',
  },
  {
    id: '1a2b3c4d-0008-0000-0000-000000000008',
    title: 'Carrot',
  },
  {
    id: '1a2b3c4d-0009-0000-0000-000000000009',
    title: 'Potato',
  },
  {
    id: '1a2b3c4d-0010-0000-0000-000000000010',
    title: 'Cheese',
  },


];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState([]);

  // 🔹 Check session on app start
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // 🔹 Listen for login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => authListener?.subscription.unsubscribe();
  }, []);

  // 🔹 Ingredient toggle
  const renderItem = ({ item }) => {
    const isSelected = selected.some(i => i.id === item.id);

    return (
      <Item
        item={item}
        onPress={() => {
          setSelected(prev =>
            isSelected
              ? prev.filter(i => i.id !== item.id)
              : [...prev, item]
          );
        }}
        backgroundColor={isSelected ? '#6e3b6e' : '#f9c2ff'}
        textColor={isSelected ? 'white' : 'black'}
      />
    );
  };

  // 🔹 Submit preferences
  const submit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Alert.alert("You must be logged in");

    const titles = selected.map(i => i.title);

    const { error } = await supabase.from('Profiles').insert({
      id: user.id,
      name: 'Test',
      preferences: titles,
    });

    if (error) console.error(error);
    else Alert.alert("Saved!");
  };

  const handleSignedIn = (user) => {
    setUser(user);
  };

  // ⛔ If not logged in → show login page only
  if (!user) {
    return (
      <SafeAreaProvider>
        <SignInScreen onSignedIn={handleSignedIn} />
      </SafeAreaProvider>
    );
  }

  // ✅ If logged in → show ingredient screen
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={{ margin: 10 }}>
          Logged in as {user.email}
        </Text>

        <Button title="Log Out" onPress={() => supabase.auth.signOut()} />

        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selected}
        />

        <Button title="Submit" onPress={submit} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: StatusBar.currentHeight || 0 },
  item: { padding: 20, marginVertical: 8, marginHorizontal: 16 },
  title: { fontSize: 32 },
});

export default App;

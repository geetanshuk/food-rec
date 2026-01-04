import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import supabase from './supa';

import SignInScreen from './loginScreen';
import Preferences from './ListOfPreferences';
import PreferencePage from './showPrefs';

export default function App() {
  const [user, setUser] = useState(null);
  const [topRecipes, setTopRecipes] = useState(null); // <-- drives page change

  // 🔹 On app load, restore session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => authListener?.subscription.unsubscribe();
  }, []);

  const handleSignedIn = (user) => setUser(user);

  // 🔹 Not logged in → login page
  if (!user) {
    return (
      <SafeAreaProvider>
        <SignInScreen onSignedIn={handleSignedIn} />
      </SafeAreaProvider>
    );
  }

  // 🔹 Logged in but no results yet → preferences page
  if (!topRecipes) {
    return (
      <SafeAreaProvider>
        <Preferences
          user={user}
          id={user.id}
          onRecommendations={(recipes) => setTopRecipes(recipes)}
        />
      </SafeAreaProvider>
    );
  }

  // 🔹 Recommendations ready → show results page
  return (
    <SafeAreaProvider>
      <PreferencePage
        top_recipes={topRecipes}
        onBack={() => setTopRecipes(null)} // optional Back button
      />
    </SafeAreaProvider>
  );
}


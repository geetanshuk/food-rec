import React, { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import supabase from './supa';
import SignInScreen from './loginScreen';
import Preferences from './ListOfPreferences';


const App = () => {
  const [user, setUser] = useState(null);
  

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

  

  const handleSignedIn = (user) => {
    setUser(user);
    {console.log("Logged in")}
  };

  // ⛔ If not logged in → show login page only
  if (!user) {
    return (
      <SafeAreaProvider>
        <SignInScreen onSignedIn={handleSignedIn} />
      </SafeAreaProvider>
    );
  } else {
    return (
        <Preferences user = {user} />
    );
  }

}

export default App;

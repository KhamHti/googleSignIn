import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId:
      "445448734454-pbodh903ous0eihni72hfk00bsit8qfk.apps.googleusercontent.com",
  });

  // Handle user state changes
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user_signin = auth().signInWithCredential(googleCredential);
    user_signin;
    // .then((user) => {
    //   console.log(user);
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  };

  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.container}>
        <GoogleSigninButton
          style={{ width: 300, height: 70, marginTop: 300 }}
          onPress={onGoogleButtonPress}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{user.displayName}</Text>
      <Image
        source={{ uri: user.photoURL }}
        style={{ width: 200, height: 200, margin: 50, borderRadius: 100 }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

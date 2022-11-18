import './shim.js'
import React, { useEffect } from 'react';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { Platform, NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import * as NavigationBar from 'expo-navigation-bar';
import StackStart from "./Pages/StackScreens/Start"
import StackHome from "./Pages/StackScreens/Home"
import StackMain from "./Pages/StackScreens/Main"
import StackLogin from "./Pages/StackScreens/Login"
import StackRiotLogin from "./Pages/StackScreens/RiotLogin"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
const deviceLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;
const languageFile = require("./language.json");

export default function App() {
  const Stack = createStackNavigator();

  if (deviceLanguage.includes("zh_TW")) {
    process.language = languageFile["zh_TW"];
  } else {
    process.language = languageFile["en_US"];
  }

  if (Platform.OS != 'ios') {
    NavigationBar.setBackgroundColorAsync("#202225")
  };

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const [fontsLoaded] = useFonts({
    'NotoSansTC-Regular': require('./assets/NotoSansTC-Regular.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  //presentation: 'transparentModal'
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          <Stack.Screen options={{ headerShown: false, animationEnabled: false }} name="Start" component={StackStart} />
          <Stack.Screen options={{ headerShown: false, ...TransitionPresets.RevealFromBottomAndroid }} name="Home" component={StackHome} />
          <Stack.Screen options={{ headerShown: true, ...TransitionPresets.SlideFromRightIOS, headerTransparent: true, headerTitle: "", headerTintColor: "#fff" }} name="Login" component={StackLogin} />
          <Stack.Screen options={{ headerShown: true, ...TransitionPresets.SlideFromRightIOS, headerBackTitle: "", headerTitle: process.language.Login.loginTitle, headerStyle: { backgroundColor: '#202225' }, headerTintColor: "#fff" }} name="RiotLogin" component={StackRiotLogin} />
          <Stack.Screen options={{ headerShown: false, ...TransitionPresets.RevealFromBottomAndroid }} name="Main" component={StackMain} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar backgroundColor="#202225" style="light" />
    </SafeAreaProvider>
  );
}
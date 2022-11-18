import React, { Component } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import TabHome from "../TabScreens/Home";
import TabProgress from "../TabScreens/Progress";
import TabCareer from "../TabScreens/Career";
import TabCollection from "../TabScreens/Collection";
import TabStore from "../TabScreens/Store";
import TabBundle from "../TabScreens/Bundle";

const Tab = createBottomTabNavigator();

const battlepassIMG = require("../../assets/tx_icon_battlepass.png");
const careerIMG = require("../../assets/tx_icon_career.png");
const collectionIMG = require("../../assets/tx_icon_collection.png");
const homeIMG = require("../../assets/tx_icon_home.png");
const storeIMG = require("../../assets/tx_icon_store.png");

export default class Main extends Component {
  constructor(props) {
    super();
    this.props = props;
  }

  UNSAFE_componentWillMount = () => {
    this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    })
  }

  render() {
    return (
      <SafeAreaInsetsContext.Consumer>
        {insets => <Tab.Navigator screenOptions={() => ({ headerShown: false, tabBarStyle: { backgroundColor: '#202225', borderTopWidth: 0, paddingBottom: insets.bottom + 5, position: 'absolute', height: (58 + insets.bottom), alignSelf: 'center', alignItems: 'center', opacity: 1, paddingTop: 0 }, tabBarInactiveTintColor: "gray", tabBarActiveTintColor: "#32C79E", tabBarAllowFontScaling: true })} >
          <Tab.Screen name="Home" options={{ tabBarButton: () => null }} component={TabHome} />
          <Tab.Screen name="Progress" options={{ tabBarLabel: process.language.TabName.Progress, tabBarIcon: (tintColor) => (<Image source={battlepassIMG} focused={tintColor.focused} style={{ width: 30, height: 30, tintColor: tintColor.color }} allowFontScaling={true} />) }} component={TabProgress} />
          <Tab.Screen name="Career" options={{ tabBarLabel: process.language.TabName.Career, tabBarIcon: (tintColor) => (<Image source={careerIMG} focused={tintColor.focused} style={{ width: 30, height: 30, tintColor: tintColor.color }} allowFontScaling={true} />) }} component={TabCareer} />
          <Tab.Screen name="Home1" options={{ tabBarLabel: "Home", tabBarIcon: (tintColor) => (<Image source={homeIMG} focused={tintColor.focused} style={{ width: 30, height: 30, tintColor: tintColor.color }} allowFontScaling={true} />) }} component={TabHome} />
          <Tab.Screen name="Collection" options={{ tabBarLabel: process.language.TabName.Collection, tabBarIcon: (tintColor) => (<Image source={collectionIMG} focused={tintColor.focused} style={{ width: 30, height: 30, tintColor: tintColor.color }} allowFontScaling={true} />) }} component={TabCollection} />
          <Tab.Screen name="Bundle" options={{ tabBarLabel: "Bundle", tabBarButton: () => null }} component={TabBundle} />
          <Tab.Screen name="Store" options={{ tabBarLabel: process.language.TabName.Store, tabBarIcon: (tintColor) => (<Image source={storeIMG} focused={tintColor.focused} style={{ width: 30, height: 30, tintColor: tintColor.color }} allowFontScaling={true} />) }} allowFontScaling={true} component={TabStore} />
        </Tab.Navigator>}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}
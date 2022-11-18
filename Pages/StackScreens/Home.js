import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Pressable, NativeModules } from 'react-native';
const deviceLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;
const { vw, vh } = require('react-native-viewport-units-fix');
const axios = require("axios").default;
const valorant = process.valorant;

export default class Main extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.loginLogo} source={require('../../assets/bot1.png')} />
        <Text style={styles.loginTitle}>{process.language.Home.loginTitle}</Text>
        <Text style={styles.loginText}>{process.language.Home.loginText}</Text>
        <Pressable style={styles.loginButton} onPress={() => { this.props.navigation.navigate('RiotLogin'); }}>
          <Text style={styles.loginButtonText}>{process.language.Home.loginButtonText}</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202225',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTitle: {
    color: 'white',
    fontSize: 26,
    marginTop: 5.5 * vh,
    fontFamily: 'NotoSansTC-Regular',
  },
  loginText: {
    fontSize: 15,
    borderColor: '#202225',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    color: 'gray',
    marginTop: 1.5 * vh,
    marginBottom: 6 * vh,
    textAlign: 'center',
    fontFamily: 'NotoSansTC-Regular',
  },
  loginLogo: {
    width: 45 * vh,
    height: 28 * vh,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 6 * vh,
    width: 90 * vw,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#5865F2',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'NotoSansTC-Regular',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});
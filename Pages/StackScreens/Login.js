import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
const { vw, vh } = require('react-native-viewport-units-fix');

export default class Main extends Component {
  constructor(props) {
    super();
    this.props = props;
    const [username, onChangeUsername] = useState("");
    this.username = username, this.onChangeUsername = onChangeUsername;
    const [password, onChangePassword] = useState("");
    this.password = password, this.onChangePassword = onChangePassword;
  }

  onPress = () => {
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <Text style={styles.loginTitle}>{process.language.Login.loginTitle}</Text>
          <TextInput style={styles.input} textContentType={'username'} onChangeText={this.onChangeUsername} placeholder={process.language.Login.username} placeholderTextColor="white" value={this.username} />
          <TextInput style={styles.input} textContentType={'password'} onChangeText={this.onChangePassword} placeholder={process.language.Login.password} placeholderTextColor="white" value={this.password} secureTextEntry={true} />
          <Pressable style={styles.loginButton} onPress={() => onPress()}>
            <Text style={styles.loginButtonText}>{process.language.Login.login}</Text>
          </Pressable>
          <StatusBar translucent={true} backgroundColor={'transparent'} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202225',
    alignItems: 'center',
    borderColor: '#202225',
    borderLeftWidth: 20,
    borderRightWidth: 20,
  },
  container1: {
    marginTop: 3 * vh,
  },
  input: {
    alignItems: 'stretch',
    justifyContent: 'center',
    borderColor: 'gray',
    borderRadius: 4,
    fontSize: 15,
    backgroundColor: 'gray',
    color: 'white',
    textAlign: 'left',
    marginBottom: 6,
    paddingHorizontal: 10,
    height: 6 * vh,
    width: 90 * vw,
  },
  riotAccount: {
    color: 'white',
    textAlign: 'left',
    paddingRight: 80 * vw,
    marginBottom: 6,
  },
  loginTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 26,
    marginTop: 5.5 * vh,
    fontFamily: 'NotoSansTC-Regular',
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
    flexWrap: 'wrap',
  }
});

module.exports = Main;
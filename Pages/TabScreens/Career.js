import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
const { vw, vh } = require('react-native-viewport-units-fix');
import { Component } from 'react';

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
        <View style={styles.container1}>
          <Text style={styles.loginTitle}>{process.account.player.GameName}#{process.account.player.TagLine}3</Text>
          <StatusBar backgroundColor="#202225" style="light" />
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
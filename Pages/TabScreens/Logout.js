import { StyleSheet, View } from 'react-native';
const { vw, vh } = require('react-native-viewport-units-fix');

function Main(props) {
  const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking');
  RCTNetworking.clearCookies(() => { });

  props.navigation.navigate('Home');

  return (
    <View style={{ backgroundColor: "#202225" }}></View>
  );
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

module.exports = Main;
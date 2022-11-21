import { StyleSheet, Text, View, Image, ScrollView, NativeModules } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const { vw, vh } = require('react-native-viewport-units-fix');
import { Component } from 'react';

export default class Main extends Component {
  constructor(props) {
    super();
    this.props = props;
  }

  componentDidMount = async () => {
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
          <View style={{ width: 100 * vw, height: -1 }}>
            <View style={styles.container1}>
              <Text style={styles.playerLevel}>{process.account.level.Level}</Text>
              <Image source={{ uri: `https://media.valorant-api.com/levelborders/${process.account.identity.PreferredLevelBorderID}/levelnumberappearance.png` }} resizeMode={'contain'} style={styles.levelBorder}></Image>
              <View>
                <Image source={require('../../assets/progressionBarStretch.png')} resizeMode={'contain'} style={styles.rankProgress}></Image>
                <View style={{ marginTop: '3.7%', position: 'absolute', marginLeft: '1.5%' }}>
                  <View style={{
                    position: 'absolute',
                    borderColor: "#22FFCC",
                    borderWidth: 1.75,
                    borderLeftWidth: ((68.5 * vw) * (process.account.level.XP / 5000)),
                    borderRadius: 8,
                    position: 'absolute',
                  }}>
                  </View>
                </View>
                <Text style={styles.levelNum}><Text style={styles.greenText}>{process.account.level.XP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>/5,000 AP to level {process.account.level.Level + 1}</Text>
              </View>
              <View style={styles.boxBottom}></View>
            </View>
          </View>
          <View style={styles.padding}></View>
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202225',
    alignItems: 'center',
    paddingTop: getStatusBarHeight(),
    includeFontPadding: false,
  },
  levelBorder: {
    width: '100%',
    height: undefined,
    aspectRatio: 10,
    zIndex: 1,
    marginTop: 10,
    includeFontPadding: false,
  },
  playerLevel: {
    color: 'white',
    fontSize: 16,
    textAlign: "center",
    fontFamily: 'NotoSansTC-Regular',
    includeFontPadding: false,
    marginTop: '4%',
    zIndex: 2,
    position: 'absolute',
  },
  container1: {
    backgroundColor: "#343840",
    borderColor: "#343840",
    marginTop: 12,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  rankProgress: {
    width: '80%',
    height: undefined,
    aspectRatio: 10,
    zIndex: 1,
    marginBottom: 23,
    includeFontPadding: false,
  },
  boxBottom: {
    marginBottom: 3,
  },
  padding: {
    paddingBottom: 68,
  },
  levelNum: {
    color: 'white',
    fontFamily: 'NotoSansTC-Regular',
    includeFontPadding: false,
    textAlign: 'center',
    marginTop: '7%',
    width: '100%',
    marginRight: '47%',
    height: '100%',
    zIndex: 0,
    fontSize: 12,
    position: 'absolute',
  },
  greenText: {
    color: "#22FFCC",
    fontWeight: 'bold',
    includeFontPadding: false,
  }
});
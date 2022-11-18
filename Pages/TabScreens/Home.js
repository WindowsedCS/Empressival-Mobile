import { StyleSheet, Text, View, Image, ScrollView, NativeModules } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const deviceLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;
import { StatusBar } from 'expo-status-bar';
const { vw, vh } = require('react-native-viewport-units-fix');
import { Component } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default class Main extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = { daily: [{ current: 0, max: 100, name: null }, { current: 0, max: 100, name: null }], weekly: [{ current: 0, max: 100, name: null }, { current: 0, max: 100, name: null }, { current: 0, max: 100, name: null }] }
  }

  componentDidMount = async () => {
    let missions = {
      daily: [],
      weekly: [],
    };
    for (let i = 0; i < process.missions.progress.length; i++) {
      if ("type" in process.missions.details[process.missions.progress[i].ID]) {
        if (process.missions.details[process.missions.progress[i].ID].type === "EAresMissionType::Daily") {
          missions.daily.push({
            name: process.missions.details[process.missions.progress[i].ID].title,
            current: Object.values(process.missions.progress[i].Objectives)[0],
            max: process.missions.details[process.missions.progress[i].ID].objectives[0].value,
          })
        } else {
          missions.weekly.push({
            name: process.missions.details[process.missions.progress[i].ID].title,
            current: Object.values(process.missions.progress[i].Objectives)[0],
            max: process.missions.details[process.missions.progress[i].ID].objectives[0].value,
          })
        }
      }
    }
    if (missions.weekly.length === 0) {
      let mission = (await axios.get(`https://api.empressival.com/mission?activate=true&lang=${deviceLanguage.includes("zh_TW") ? "zh-TW" : "en-US"}`)).data;
      missions.weekly = [
        {
          current: 100,
          max: 100,
          name: Object.values(mission.data)[0].title
        },
        {
          current: 100,
          max: 100,
          name: Object.values(mission.data)[1].title
        },
        {
          current: 100,
          max: 100,
          name: Object.values(mission.data)[2].title
        }
      ]
    }
    this.setState({ daily: missions.daily, weekly: missions.weekly });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
          <View style={{ width: 100 * vw, height: -1 }}>
            <View style={styles.containerCard}>
              <Image source={{ uri: `https://media.valorant-api.com/playercards/${process.account.identity.PlayerCardID}/largeart.png` }} style={styles.playerCard} resizeMode={'contain'}></Image>
              <LinearGradient colors={['rgba(32,34,37,0)', 'rgba(32,34,37,0)', 'rgba(32,34,37,0)', 'rgba(32,34,37,0.2)', 'rgba(32,34,37,0.6)', 'rgba(32,34,37,1)']} style={styles.playerCard} />
              <Image source={{ uri: `https://media.valorant-api.com/levelborders/${process.account.identity.PreferredLevelBorderID}/levelnumberappearance.png` }} resizeMode={'contain'} style={styles.levelBorder}></Image>
              <Text style={styles.playerName}>{process.account.player.GameName}#{process.account.player.TagLine}</Text>
              <Text style={styles.playerLevel}>{process.account.level}</Text>
              <Image source={{ uri: `${require("../../valorant.js").Tiers.image[process.account.competitiveTier]}` }} resizeMode={'contain'} style={styles.playerRank}></Image>
              <Image source={require('../../assets/playerCardBg.png')} resizeMode={'contain'} style={styles.playerCardBg}></Image>
              <Text></Text>
            </View>
            <Text></Text>
            <View style={styles.container1}>
              <Text style={styles.actRank}>{process.language.TabHome.actRank}</Text>
              <Image source={{ uri: `${require("../../valorant.js").Tiers.image[process.account.competitiveTier]}` }} resizeMode={'contain'} style={styles.playerRank1}></Image>
              <Text style={styles.rank}>{(require("../../valorant.js").Tiers.name[process.account.competitiveTier]).toUpperCase()}</Text>
              <View>
                <Image source={require('../../assets/progressionBarStretch.png')} resizeMode={'contain'} style={styles.rankProgress}></Image>
                <View style={{ marginTop: '3.7%', position: 'absolute', marginLeft: '1.5%' }}>
                  <View style={{
                    position: 'absolute',
                    borderColor: "#22FFCC",
                    borderWidth: 1.75,
                    borderLeftWidth: ((68.5 * vw) * (process.account.rankedRating / 100)),
                    borderRadius: 8,
                    position: 'absolute',
                  }}>
                  </View>
                </View>
                <Text style={styles.rankRatingText}>{process.language.TabHome.rankRating}</Text>
                <Text style={styles.rankRatingTextNum}><Text style={styles.greenText}>{process.account.rankedRating}</Text>{process.account.competitiveTier < 24 ? '/100' : ""}</Text>
              </View>
              <View style={styles.boxBottom}></View>
            </View>
            <View style={[styles.container1, { borderBottomRightRadius: 0, borderBottomLeftRadius: 0, borderBottomWidth: 1, borderBottomColor: 'white' }]}>
              <View style={{ marginBottom: 10 }}>
                <Text style={[styles.actRank, { textAlign: 'center', marginBottom: 10 }]}>{process.language.TabHome.vp}</Text>
                <Image source={require('../../assets/vp.png')} resizeMode={'contain'} style={{ width: '100%', height: undefined, aspectRatio: 8, zIndex: 1 }}></Image>
                <Text style={{ textAlign: 'center', marginTop: 5, fontFamily: 'NotoSansTC-Regular', color: 'white', includeFontPadding: false, fontSize: 18 }}>{process.account.wallet["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"]}</Text>
              </View>
            </View>
            <View style={[styles.container1, { marginTop: 0, borderTopRightRadius: 0, borderTopLeftRadius: 0 }]}>
              <View style={{ marginBottom: 10 }}>
                <Text style={[styles.actRank, { textAlign: 'center', marginBottom: 10 }]}>{process.language.TabHome.rp}</Text>
                <Image source={require('../../assets/rp.png')} resizeMode={'contain'} style={{ width: '100%', height: undefined, aspectRatio: 8, zIndex: 1 }}></Image>
                <Text style={{ textAlign: 'center', marginTop: 5, fontFamily: 'NotoSansTC-Regular', color: 'white', includeFontPadding: false, fontSize: 18 }}>{process.account.wallet["e59aa87c-4cbf-517a-5983-6e81511be9b7"]}</Text>
              </View>
            </View>
            <View style={styles.container1}>
              <Text style={styles.actRank}>{process.language.TabHome.daily}</Text>
              <View>
                <Image source={require('../../assets/progressionBarStretch.png')} resizeMode={'contain'} style={styles.rankProgress}></Image>
                <View style={{ marginTop: '3.7%', position: 'absolute', marginLeft: '1.5%' }}>
                  <View style={{
                    position: 'absolute',
                    borderColor: "#22FFCC",
                    borderWidth: 1.75,
                    borderLeftWidth: ((68.5 * vw) * (this.state.daily[0].current / this.state.daily[0].max)),
                    borderRadius: 8,
                    position: 'absolute',
                  }}>
                  </View>
                </View>
                <Text style={styles.rankRatingText}>{this.state.daily[0].name}</Text>
                <Text style={styles.rankRatingTextNum}>{this.state.daily[0].current} / {this.state.daily[0].max}</Text>
              </View>
              <View>
                <Image source={require('../../assets/progressionBarStretch.png')} resizeMode={'contain'} style={styles.rankProgress}></Image>
                <View style={{ marginTop: '3.69%', position: 'absolute', marginLeft: '1.5%' }}>
                  <View style={{
                    position: 'absolute',
                    borderColor: "#22FFCC",
                    borderWidth: 1.75,
                    borderLeftWidth: ((68.5 * vw) * (this.state.daily[1].current / this.state.daily[1].max)),
                    borderRadius: 8,
                    position: 'absolute',
                  }}>
                  </View>
                </View>
                <Text style={styles.rankRatingText}>{this.state.daily[1].name}</Text>
                <Text style={styles.rankRatingTextNum}>{this.state.daily[1].current} / {this.state.daily[1].max}</Text>
              </View>
              <Text style={styles.actRank}>{process.language.TabHome.weekly}</Text>
              <View>
                <Image source={require('../../assets/progressionBarStretch.png')} resizeMode={'contain'} style={styles.rankProgress}></Image>
                <View style={{ marginTop: '3.68%', position: 'absolute', marginLeft: '1.5%' }}>
                  <View style={{
                    position: 'absolute',
                    borderColor: "#22FFCC",
                    borderWidth: 1.75,
                    borderLeftWidth: ((68.5 * vw) * (this.state.weekly[0].current / this.state.weekly[0].max)),
                    borderRadius: 8,
                    position: 'absolute',
                  }}>
                  </View>
                </View>
                <Text style={styles.rankRatingText}>{this.state.weekly[0].name}</Text>
                <Text style={styles.rankRatingTextNum}>{this.state.weekly[0].current} / {this.state.weekly[0].max}</Text>
              </View>
              <View>
                <Image source={require('../../assets/progressionBarStretch.png')} resizeMode={'contain'} style={styles.rankProgress}></Image>
                <View style={{ marginTop: '3.7%', position: 'absolute', marginLeft: '1.5%' }}>
                  <View style={{
                    position: 'absolute',
                    borderColor: "#22FFCC",
                    borderWidth: 1.75,
                    borderLeftWidth: ((68.5 * vw) * (this.state.weekly[1].current / this.state.weekly[1].max)),
                    borderRadius: 8,
                    position: 'absolute',
                  }}>
                  </View>
                </View>
                <Text style={styles.rankRatingText}>{this.state.weekly[1].name}</Text>
                <Text style={styles.rankRatingTextNum}>{this.state.weekly[1].current} / {this.state.weekly[1].max}</Text>
              </View>
              <View>
                <Image source={require('../../assets/progressionBarStretch.png')} resizeMode={'contain'} style={styles.rankProgress}></Image>
                <View style={{ marginTop: '3.67%', position: 'absolute', marginLeft: '1.5%' }}>
                  <View style={{
                    position: 'absolute',
                    borderColor: "#22FFCC",
                    borderWidth: 1.75,
                    borderLeftWidth: ((68.5 * vw) * (this.state.weekly[2].current / this.state.weekly[2].max)),
                    borderRadius: 8,
                    position: 'absolute',
                  }}>
                  </View>
                </View>
                <Text style={styles.rankRatingText}>{this.state.weekly[2].name}</Text>
                <Text style={styles.rankRatingTextNum}>{this.state.weekly[2].current} / {this.state.weekly[2].max}</Text>
              </View>
              <View style={styles.boxBottom}></View>
            </View>
          </View>
          <View style={styles.padding}></View>
        </ScrollView>
        <StatusBar backgroundColor="#202225" style="light" />
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
  containerCard: {
    alignItems: 'center',
    marginTop: 10,
    borderBottomColor: "white",
    borderBottomWidth: 2,
    paddingBottom: 10
  },
  welcomeBack: {
    color: 'white',
    textAlign: "center",
    fontSize: 26,
    fontFamily: 'NotoSansTC-Regular',
    includeFontPadding: false,
    paddingTop: 40,
  },
  playerName: {
    color: 'black',
    fontSize: 19,
    textAlign: "center",
    fontFamily: 'NotoSansTC-Regular',
    includeFontPadding: false,
    marginTop: "112.3%",
    zIndex: 2,
    position: 'absolute'
  },
  playerLevel: {
    color: 'white',
    fontSize: 14,
    textAlign: "center",
    fontFamily: 'NotoSansTC-Regular',
    includeFontPadding: false,
    marginTop: 4,
    zIndex: 2,
    position: 'absolute',
  },
  playerCard: {
    width: '70%',
    height: undefined,
    aspectRatio: 0.42,
    marginTop: 16.5,
    display: 'flex',
    position: 'absolute',
  },
  playerCardBg: {
    width: '74%',
    height: undefined,
    aspectRatio: 0.418,
    marginTop: 0,
    position: 'relative',
    marginTop: 5,
    zIndex: 0,
  },
  playerRank: {
    display: 'flex',
    width: '19%',
    height: undefined,
    position: 'absolute',
    marginTop: '112.8%',
    zIndex: 2,
  },
  levelBorder: {
    width: '20%',
    height: undefined,
    aspectRatio: 2.6,
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
  actRank: {
    fontFamily: 'NotoSansTC-Regular',
    color: 'white',
    fontSize: 20,
    marginTop: 10,
    includeFontPadding: false,
  },
  rank: {
    fontFamily: 'NotoSansTC-Regular',
    color: 'white',
    fontSize: 20,
    marginBottom: 9,
    includeFontPadding: false,
  },
  playerRank1: {
    width: '50%',
    height: undefined,
    aspectRatio: 1,
    zIndex: 1,
    includeFontPadding: false,
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
  rankRatingText: {
    color: 'white',
    marginLeft: '1.5%',
    fontFamily: 'NotoSansTC-Regular',
    includeFontPadding: false,
    textAlign: 'left',
    marginTop: '5.5%',
    fontSize: 12,
    width: 68.5 * vw,
    position: 'absolute',
  },
  rankRatingTextNum: {
    color: 'white',
    fontFamily: 'NotoSansTC-Regular',
    includeFontPadding: false,
    textAlign: 'right',
    marginTop: '5.5%',
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
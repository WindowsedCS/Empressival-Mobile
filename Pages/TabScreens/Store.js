import { StyleSheet, Text, View, Image, ScrollView, NativeModules } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Component } from 'react';
const { vw, vh } = require('react-native-viewport-units-fix');
const { valorant } = process;
const deviceLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;

export default class Main extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      collection: "",
      bundleDuration: "",
      bundleImage: "",
      bundleColor: "#343840",
      offerDuration: "",
      offerName: [],
      offerImage: [],
      offerCost: [],
    }
  }

  onTouchStartFn = () => {
    this.setState({ bundleColor: "#42474D" });
  }

  onTouchEndFn = () => {
    this.setState({ bundleColor: "#343840" });
  }

  countdown = (bundleTime, offerTime) => {
    this.setState({ bundleDuration: this.secondsToDhms(bundleTime), offerDuration: this.secondsToDhms(offerTime) });
    setInterval(async () => {
      bundleTime--;
      offerTime--;
      this.setState({ bundleDuration: this.secondsToDhms(bundleTime), offerDuration: this.secondsToDhms(offerTime) });
    }, 1000);
  }

  UNSAFE_componentWillMount = () => {
    valorant.getPlayerStoreFront(valorant.user_id).then(async (response) => {
      process.account.store = response.data;
      axios.get(`https://valorant-api.com/v1/bundles/${response.data.FeaturedBundle.Bundle.DataAssetID}?language=${deviceLanguage.includes("zh_TW") ? "zh-TW" : "en-US"}`).then(async (bundle) => {
        process.account.bundle = bundle.data.data;
        let offerImage = [];
        offerImage[0] = `https://media.valorant-api.com/weaponskinlevels/${response.data.SkinsPanelLayout.SingleItemOffers[0]}/displayicon.png`
        offerImage[1] = `https://media.valorant-api.com/weaponskinlevels/${response.data.SkinsPanelLayout.SingleItemOffers[1]}/displayicon.png`
        offerImage[2] = `https://media.valorant-api.com/weaponskinlevels/${response.data.SkinsPanelLayout.SingleItemOffers[2]}/displayicon.png`
        offerImage[3] = `https://media.valorant-api.com/weaponskinlevels/${response.data.SkinsPanelLayout.SingleItemOffers[3]}/displayicon.png`
        axios.get(`https://api.empressival.com/store?ids=${response.data.SkinsPanelLayout.SingleItemOffers[0]}%20${response.data.SkinsPanelLayout.SingleItemOffers[1]}%20${response.data.SkinsPanelLayout.SingleItemOffers[2]}%20${response.data.SkinsPanelLayout.SingleItemOffers[3]}`).then(async (weapons) => {
          let weaponList = [
            Object.values(weapons.data.data)[0][deviceLanguage.split("_")[0]],
            Object.values(weapons.data.data)[1][deviceLanguage.split("_")[0]],
            Object.values(weapons.data.data)[2][deviceLanguage.split("_")[0]],
            Object.values(weapons.data.data)[3][deviceLanguage.split("_")[0]],
          ]
          let costList = [
            Object.values(weapons.data.data)[0].cost,
            Object.values(weapons.data.data)[1].cost,
            Object.values(weapons.data.data)[2].cost,
            Object.values(weapons.data.data)[3].cost,
          ]
          this.setState({
            bundleImage: `https://media.valorant-api.com/bundles/${response.data.FeaturedBundle.Bundle.DataAssetID}/displayicon.png`,
            collection: bundle.data.data.displayName,
            offerImage: offerImage,
            offerName: weaponList,
            offerCost: costList,
          })
          this.secondsToDhms(response.data.FeaturedBundle.Bundle.DurationRemainingInSeconds);
          this.countdown(response.data.FeaturedBundle.Bundle.DurationRemainingInSeconds, response.data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds);
        })
      })
    })
  }

  secondsToDhms = (seconds) => {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + ":" : "";
    var hDisplay = h > 0 ? (h < 10 ? "0" + h : h) + ":" : "00:";
    var mDisplay = m > 0 ? (m < 10 ? "0" + m : m) + ":" : "00:";
    var sDisplay = (s < 10 ? "0" + s : s);
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  render() {
    let tempIMG = require("../../assets/bot1.png");
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            backgroundColor: this.state.bundleColor,
            borderColor: this.state.bundleColor,
            borderRadius: 8,
            marginTop: 5,
            marginRight: 20,
            marginLeft: 20,
            alignItems: 'center',
          }} onTouchStart={() => this.onTouchStartFn()} onTouchEnd={() => this.onTouchEndFn()} onTouchCancel={() => this.onTouchEndFn()} onTouchEndCapture={() => { this.props.navigation.navigate('Bundle'); }}>
            <Text style={[styles.featured, { includeFontPadding: false, marginTop: 10, marginBottom: 10 }]}>{process.language.TabStore.featured} | {this.state.bundleDuration}</Text>
            <Image source={(this.state.bundleImage != "" ? { uri: this.state.bundleImage } : tempIMG)} resizeMode={'contain'} style={styles.imageBundle}></Image>
            <Text style={[styles.collection, { includeFontPadding: false, marginTop: 10, marginBottom: 10 }]}>{this.state.collection} {process.language.TabStore.collection}</Text>
          </View>
          <View style={styles.containerOffers}>
            <Text style={[styles.featured, { includeFontPadding: false, marginTop: 10, marginBottom: 10 }]}>{process.language.TabStore.offers} | {this.state.offerDuration}</Text>
          </View>
          <View style={styles.container1}>
            <Text style={styles.offerName}>{this.state.offerName[0]}</Text>
            <Image source={(this.state.offerImage[0] != "" ? { uri: this.state.offerImage[0] } : tempIMG)} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.offerCost[0]} VP</Text>
          </View>
          <View style={styles.container1}>
            <Text style={styles.offerName}>{this.state.offerName[1]}</Text>
            <Image source={(this.state.offerImage[1] != "" ? { uri: this.state.offerImage[1] } : tempIMG)} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.offerCost[1]} VP</Text>
          </View>
          <View style={styles.container1}>
            <Text style={styles.offerName}>{this.state.offerName[2]}</Text>
            <Image source={(this.state.offerImage[2] != "" ? { uri: this.state.offerImage[2] } : tempIMG)} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.offerCost[2]} VP</Text>
          </View>
          <View style={styles.container1Bottom}>
            <Text style={styles.offerName}>{this.state.offerName[3]}</Text>
            <Image source={(this.state.offerImage[3] != "" ? { uri: this.state.offerImage[3] } : tempIMG)} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.offerCost[3]} VP</Text>
          </View>
          <View style={{ paddingTop: 68 }}></View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202225',
    paddingTop: getStatusBarHeight(),
    includeFontPadding: false,
  },
  container1: {
    backgroundColor: "#343840",
    borderColor: "#343840",
    marginTop: 0,
    marginRight: 20,
    marginLeft: 20,
    alignItems: 'center',
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  container1Bottom: {
    backgroundColor: "#343840",
    borderColor: "#343840",
    marginTop: 0,
    marginRight: 20,
    marginLeft: 20,
    alignItems: 'center',
    borderRadius: 0,
    borderBottomStartRadius: 8,
    borderBottomRightRadius: 8,
  },
  containerOffers: {
    backgroundColor: "#343840",
    borderColor: "#343840",
    borderRadius: 0,
    borderTopStartRadius: 8,
    borderTopRightRadius: 8,
    marginTop: 15,
    marginRight: 20,
    marginLeft: 20,
    alignItems: 'center',
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  imageBundle: {
    width: '95%',
    height: undefined,
    aspectRatio: 2,
    borderRadius: 5,
  },
  imageOffer: {
    width: '100%',
    height: 150,
    aspectRatio: 2,
    marginTop: 10,
    marginBottom: 10
  },
  offerName: {
    color: 'white',
    includeFontPadding: false,
    fontSize: 21.5,
    fontFamily: 'NotoSansTC-Regular',
    textAlign: "center",
    paddingTop: 10
  },
  offerCost: {
    color: 'white',
    includeFontPadding: false,
    fontSize: 21.5,
    fontFamily: 'NotoSansTC-Regular',
    textAlign: "center",
    paddingBottom: 10
  },
  featured: {
    color: 'white',
    fontSize: 23,
    fontFamily: 'NotoSansTC-Regular',
    textAlign: "center",
  },
  collection: {
    color: 'white',
    fontSize: 23,
    fontFamily: 'NotoSansTC-Regular',
    textAlign: "center",
  },
});

module.exports = Main;
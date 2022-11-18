import { StyleSheet, Text, View, Image, ScrollView, NativeModules } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Component } from 'react';
const { vw, vh } = require('react-native-viewport-units-fix');
const deviceLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;

export default class Main extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      data: {
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
      }
    };
  }

  UNSAFE_componentWillMount = () => {
    let items = "";
    for (let i = 0; i < process.account.store.FeaturedBundle.Bundle.Items.length; i++) {
      items += `%20${process.account.store.FeaturedBundle.Bundle.Items[i].Item.ItemID}`;
    }
    axios.get(`https://api.empressival.com/store?ids=${items.replace("%20", "")}`).then(async (weapons) => {
      let full = {};
      for (let item = 0; item < process.account.store.FeaturedBundle.Bundle.Items.length; item++) {
        let json = {};
        if (process.account.store.FeaturedBundle.Bundle.Items[item].Item.ItemID in weapons.data.data) {
          console.log(item + 1)
          json = {
            name: weapons.data.data[process.account.store.FeaturedBundle.Bundle.Items[item].Item.ItemID][deviceLanguage.split("_")[0]],
            image: `https://media.valorant-api.com/weaponskinlevels/${process.account.store.FeaturedBundle.Bundle.Items[item].Item.ItemID}/displayicon.png`,
            price: process.account.store.FeaturedBundle.Bundle.Items[item].BasePrice,
            style: styles.container1
          }
          full[item + 1] = json;
        }
      }
      this.setState({ data: full });
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            backgroundColor: "#343840",
            borderColor: "#343840",
            borderRadius: 8,
            marginTop: 5,
            marginRight: 20,
            marginLeft: 20,
            alignItems: 'center',
          }}>
            <Text style={[styles.featured, { includeFontPadding: false, marginTop: 10, marginBottom: 10 }]}>{process.language.TabStore.featured}</Text>
            <Image source={{ uri: `https://media.valorant-api.com/bundles/${process.account.store.FeaturedBundle.Bundle.DataAssetID}/displayicon.png` }} resizeMode={'contain'} style={styles.imageBundle}></Image>
            <Text style={[styles.collection, { includeFontPadding: false, marginTop: 10, marginBottom: 10 }]}>{process.account.bundle.displayName} {process.language.TabStore.collection}</Text>
          </View>
          <View style={styles.containerOffers}>
            <Text style={[styles.featured, { includeFontPadding: false, marginTop: 10, marginBottom: 10 }]}>Items in Bundle</Text>
          </View>
          <View style={this.state.data["1"] != null ? this.state.data["1"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["1"] != null ? this.state.data["1"].name : ""}</Text>
            <Image source={{ uri: this.state.data["1"] != null ? this.state.data["1"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["1"] != null ? this.state.data["1"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["2"] != null ? this.state.data["2"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["2"] != null ? this.state.data["2"].name : ""}</Text>
            <Image source={{ uri: this.state.data["2"] != null ? this.state.data["2"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["2"] != null ? this.state.data["2"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["3"] != null ? this.state.data["3"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["3"] != null ? this.state.data["3"].name : ""}</Text>
            <Image source={{ uri: this.state.data["3"] != null ? this.state.data["3"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["3"] != null ? this.state.data["3"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["4"] != null ? this.state.data["4"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["4"] != null ? this.state.data["4"].name : ""}</Text>
            <Image source={{ uri: this.state.data["4"] != null ? this.state.data["4"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["4"] != null ? this.state.data["4"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["5"] != null ? this.state.data["5"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["5"] != null ? this.state.data["5"].name : ""}</Text>
            <Image source={{ uri: this.state.data["5"] != null ? this.state.data["5"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["5"] != null ? this.state.data["5"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["6"] != null ? this.state.data["6"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["6"] != null ? this.state.data["6"].name : ""}</Text>
            <Image source={{ uri: this.state.data["6"] != null ? this.state.data["6"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["6"] != null ? this.state.data["6"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["7"] != null ? this.state.data["7"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["7"] != null ? this.state.data["7"].name : ""}</Text>
            <Image source={{ uri: this.state.data["7"] != null ? this.state.data["7"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["7"] != null ? this.state.data["7"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["8"] != null ? this.state.data["8"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["8"] != null ? this.state.data["8"].name : ""}</Text>
            <Image source={{ uri: this.state.data["8"] != null ? this.state.data["8"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["8"] != null ? this.state.data["8"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["9"] != null ? this.state.data["9"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["9"] != null ? this.state.data["9"].name : ""}</Text>
            <Image source={{ uri: this.state.data["9"] != null ? this.state.data["9"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["9"] != null ? this.state.data["9"].price : ""} VP</Text>
          </View>
          <View style={this.state.data["10"] != null ? this.state.data["10"].style : styles.invisible}>
            <Text style={styles.offerName}>{this.state.data["10"] != null ? this.state.data["10"].name : ""}</Text>
            <Image source={{ uri: this.state.data["10"] != null ? this.state.data["10"].image : "https://empressival.com/assets/images/empressival-title.png" }} resizeMode={'contain'} style={styles.imageOffer}></Image>
            <Text style={styles.offerCost}>{this.state.data["10"] != null ? this.state.data["10"].price : ""} VP</Text>
          </View>
          <View style={{ paddingTop: 68 }}></View>
        </ScrollView>
        <StatusBar backgroundColor="#202225" style="light" />
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
  invisible: {
    display: 'none'
  }
});

module.exports = Main;
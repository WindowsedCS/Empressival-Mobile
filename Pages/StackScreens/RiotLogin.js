import React, { Component } from 'react';
import { Platform, NativeModules, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Spinner from 'react-native-loading-spinner-overlay';
import { vh, vw } from 'react-native-viewport-units-fix';
const querystring = require('querystring');
const urlModule = require('url');
const axios = require("axios").default;
const valorant = process.valorant;
const deviceLanguage = Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] : NativeModules.I18nManager.localeIdentifier;

export default class Main extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      loading: false,
      style: { display: 'flex' },
      url: `https://auth.riotgames.com/login#client_id=play-valorant-web-prod&nonce=1&redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&response_type=token%20id_token&scope=account%20openid&ui_locales=${deviceLanguage.includes("zh_TW") ? "zh-Hant" : "en-US"}`,
    }
  }

  UNSAFE_componentWillMount = async () => {
    this.authencated = false;
  }

  getUserData() {
    valorant.login(process.account.access_token, process.account.id_token).then(async () => {
      valorant.getClientVersion().then(async () => {
        valorant.getRegion().then(async () => {
          const player = await valorant.getPlayers([valorant.user_id]);
          const loadout = await valorant.getPlayerLoadout(valorant.user_id);
          const mmr = await valorant.getPlayerMMR(valorant.user_id);
          const seasonId = await valorant.getSeasonID();
          const xp = await valorant.getPlayerAccountXp(valorant.user_id);
          const contracts = await valorant.getContracts(valorant.user_id);
          const wallet = await valorant.getPlayerWallet(valorant.user_id);
          process.missions = {
            progress: contracts.data.Missions
          }
          let idList = "";
          for (let i = 0; i < contracts.data.Missions.length; i++) {
            idList += `%20${contracts.data.Missions[i].ID}`
          }
          axios.get(`https://api.empressival.com/mission?ids=${idList.replace("%20", "")}&lang=${deviceLanguage.includes("zh_TW") ? "zh-TW" : "en-US"}`).then(async (missions) => {
            process.missions.details = missions.data.data;
            // const offers = await valorant.getStoreOffers();
            // const settings = valorant.getPlayerSettings();
            process.account.level = xp.data.Progress;
            process.account.identity = loadout.data.Identity;
            process.account.competitiveTier = (mmr.data.QueueSkills.competitive.CurrentSeasonGamesNeededForRating == 0) ? mmr.data.QueueSkills.competitive.SeasonalInfoBySeasonID[seasonId].CompetitiveTier : 0;
            process.account.rankedRating = (mmr.data.QueueSkills.competitive.CurrentSeasonGamesNeededForRating == 0) ? mmr.data.QueueSkills.competitive.SeasonalInfoBySeasonID[seasonId].RankedRating : 0;
            process.account.player = player.data[0];
            process.account.wallet = wallet.data.Balances;
            this.setState({ loading: false });
            this.props.navigation.navigate('Main');
          })
        })
      });
    })
  }

  render() {
    return (
      <View style={{ backgroundColor: "#202225", flex: 1, width: 100 * vw, height: 100 * vh }}>
        <Spinner visible={this.state.loading} textContent={process.language.Start.loadingTime} textStyle={{ color: "white", fontSize: 15, textAlign: 'center', fontFamily: 'NotoSansTC-Regular' }} />
        <WebView
          style={this.state.style}
          userAgent={Platform.OS === 'ios' ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1" : "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"}
          source={{ uri: `${this.state.url}` }}
          onError={(syntheticEvent) => { syntheticEvent.preventDefault(); }}
          onNavigationStateChange={async (event) => {
            let url = event.url;
            if (url.startsWith("https://playvalorant.com/opt_in")) {
              if (this.authencated === true) return;
              this.authencated = true;
              let parsedUrl = urlModule.parse(url);
              let hash = parsedUrl.hash.replace('#', '');
              let parts = querystring.parse(hash);
              process.account = {
                id_token: parts.id_token,
                access_token: parts.access_token,
              }
              if (Platform.OS === 'ios') {
                this.setState({ loading: true, style: { display: 'none', width: 0, height: 0 } });
                this.getUserData();
              } else {
                this.setState({ url: "https://auth.riotgames.com/login#client_id=riot-client&nonce=69420&redirect_uri=http%3A%2F%2Flocalhost%2Fredirect&response_type=token%20id_token&scope=account%20openid%20link%20ban%20lol_region" })
              }
            } else if (url.startsWith("http://localhost/redirect")) {
              let parsedUrl = urlModule.parse(url);
              let hash = parsedUrl.hash.replace('#', '');
              let parts = querystring.parse(hash);
              process.account.access_token_client = parts.access_token;
              this.setState({ loading: true, style: { display: 'none', width: 0, height: 0 } });
              this.getUserData();
            }
          }}
          sharedCookiesEnabled={true}
        />
      </View>
    );
  }
}

module.exports = Main;